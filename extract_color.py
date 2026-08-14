import sys
from PIL import Image

def get_dominant_color(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        # Sample a pixel from a region that's definitely the background (e.g. top left corner)
        pixel = img.getpixel((10, 10))
        # Also sample the pill background
        # We need to find the pill container. Let's just sample a few points
        width, height = img.size
        # Print a few pixels
        print("Top left (Background):", img.getpixel((10, 10)))
        print("Middle top:", img.getpixel((width//2, 10)))
        print("Middle (Pill container?):", img.getpixel((width*3//4, height//2)))
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        get_dominant_color(sys.argv[1])
