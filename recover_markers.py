# recover_markers.py
import os
import sys
from PIL import Image
import numpy as np

def parse_patt(file_path):
    """Извлекает матрицу из .patt файла"""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    # Найдём строку "PATT"
    try:
        patt_idx = lines.index("PATT")
    except ValueError:
        raise ValueError(f"Файл {file_path} не содержит 'PATT' — не является AR-маркером")

    # Следующие строки — размеры и данные
    width_line = lines[patt_idx + 1].split()
    if len(width_line) < 3:
        raise ValueError(f"Неверный формат размеров в {file_path}")

    try:
        width = int(float(width_line[0]))
        height = int(float(width_line[1]))
    except:
        raise ValueError(f"Не удалось прочитать размеры в {file_path}")

    # Собираем числа из остальных строк
    data_lines = []
    for line in lines[patt_idx + 2:]:
        if line.startswith('#'):
            continue
        nums = []
        for word in line.split():
            try:
                nums.append(int(word))
            except:
                pass
        if nums:
            data_lines.extend(nums)

    if len(data_lines) < width * height:
        raise ValueError(f"Недостаточно данных: ожидается {width*height}, получено {len(data_lines)}")

    # Берём первые width*height чисел
    matrix = np.array(data_lines[:width * height], dtype=np.uint8).reshape((height, width))

    # Нормализуем: 0–128 → чёрный, 129–255 → белый
    img_array = np.where(matrix > 128, 255, 0).astype(np.uint8)
    return img_array, width, height

def main():
    markers_dir = os.path.join(os.getcwd(), "js", "markers")
    if not os.path.isdir(markers_dir):
        print(f"Папка не найдена: {markers_dir}  Untitled1:56 - recover_markers.py:56")
        return

    patt_files = [f for f in os.listdir(markers_dir) if f.lower().endswith('.patt')]
    if not patt_files:
        print("❌ Не найдено ни одного .patt файла в js/markers/  Untitled1:61 - recover_markers.py:61")
        return

    print(f"Найдено {len(patt_files)} .patt файлов:  Untitled1:64 - recover_markers.py:64")
    for i, fname in enumerate(patt_files, 1):
        print(f"{i}. {fname}  Untitled1:66 - recover_markers.py:66")

    # Сортируем по имени для предсказуемости
    patt_files.sort()

    for idx, fname in enumerate(patt_files, 1):
        full_path = os.path.join(markers_dir, fname)
        try:
            img_data, w, h = parse_patt(full_path)
            # Создаём изображение
            img = Image.fromarray(img_data, mode='L')
            # Сохраняем как burgerN.png
            out_name = f"burger{idx}.png"
            out_path = os.path.join(markers_dir, out_name)
            img.save(out_path)
            print(f"✅ Сохранено: {out_name} ({w}x{h}) из {fname}  Untitled1:81 - recover_markers.py:81")
        except Exception as e:
            print(f"❌ Ошибка при обработке {fname}: {e}  Untitled1:83 - recover_markers.py:83")

if __name__ == "__main__":
    main()