"""把天工开物原版插图 PNG 的白色背景变透明，保留墨线/木质结构"""
from PIL import Image
import sys

def whiten_to_alpha(input_path, output_path, threshold=235):
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (r, g, b, 0)
            else:
                min_val = min(r, g, b)
                if min_val > threshold - 25:
                    fade = (threshold - min_val) / 25
                    new_alpha = int(a * fade)
                    pixels[x, y] = (r, g, b, new_alpha)
    img.save(output_path, 'PNG')
    print(f"Saved: {output_path} ({w}x{h})")

if __name__ == '__main__':
    for name in ['tongche.png', 'longgushuiche.png']:
        whiten_to_alpha(
            f'/Users/zhangxuetao/tiangong/tiangong-3d-demo/public/pic/{name}',
            f'/Users/zhangxuetao/tiangong/tiangong-3d-demo/public/pic/{name}',
        )
