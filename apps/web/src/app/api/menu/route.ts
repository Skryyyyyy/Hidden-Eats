import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    dishes: [
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
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dishId, isStock } = body;

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
