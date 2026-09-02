import { NextResponse } from 'next/server';
import { SecuritySchemas, hasSqlInjectionPattern, verifyTrustedOrigin } from '@/lib/security';
import { checkDistributedRateLimit, getClientIp } from '@/lib/rateLimit';
import { createAdminClient } from '@/lib/supabase';

const DEFAULT_DISHES = [
  {
    id: 'DISH_1',
    name: 'Seeraga Samba Mutton Biryani',
    category: 'Biryani',
    price: 280,
    isStock: true,
    isSecret: false,
  },
  {
    id: 'DISH_2',
    name: 'Kallu Kadai Mutton Chukka',
    category: 'Snacks',
    price: 220,
    isStock: true,
    isSecret: true,
  },
];

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data && data.length > 0) {
      const formatted = data.map((d: any) => ({
        id: d.id,
        name: d.name,
        category: d.category || 'Special',
        price: Number(d.price) || 0,
        isStock: d.is_available ?? true,
        isSecret: d.is_secret ?? false,
      }));
      return NextResponse.json({ dishes: formatted, source: 'supabase' });
    }
  } catch {
    // Fallback gracefully
  }

  return NextResponse.json({
    dishes: DEFAULT_DISHES,
    source: 'fallback',
  });
}

export async function POST(request: Request) {
  try {
    // 1. Origin & CSRF Verification
    if (!verifyTrustedOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden: Untrusted cross-site request origin' },
        { status: 403 }
      );
    }

    // 2. Distributed Rate Limiting Protection
    const clientIp = getClientIp(request);
    const rateLimit = await checkDistributedRateLimit(`menu_post_${clientIp}`, 40, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.reset - Date.now()) / 1000)) } }
      );
    }

    const rawBody = await request.json();
    const parseResult = SecuritySchemas.menuStatus.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid dish payload or malformed parameters' },
        { status: 400 }
      );
    }

    const { dishId, isStock } = parseResult.data;

    if (hasSqlInjectionPattern(dishId)) {
      return NextResponse.json(
        { error: 'Security violation: Disallowed SQL characters detected in dish identifier' },
        { status: 403 }
      );
    }

    // 3. Update Supabase if available
    try {
      const supabase = createAdminClient();
      await supabase
        .from('menu_items')
        .update({ is_available: isStock, updated_at: new Date().toISOString() })
        .eq('id', dishId);
    } catch {
      // Continue gracefully
    }

    return NextResponse.json({
      success: true,
      message: `Dish status updated to ${isStock ? 'In Stock' : '86ed / Sold Out'}`,
      dishId,
      isStock,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update menu dish status' },
      { status: 500 }
    );
  }
}
