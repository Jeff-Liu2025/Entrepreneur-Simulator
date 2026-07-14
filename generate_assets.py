from pathlib import Path

BASE = Path(r"c:\Users\123\Desktop\创业模拟器\assets")


def svg_from_grid(grid, cell_size, palette, width=None, height=None):
    rows = len(grid)
    cols = max(len(row) for row in grid)
    w = width or cols * cell_size
    h = height or rows * cell_size
    rects = []
    for y, row in enumerate(grid):
        for x, ch in enumerate(row):
            if ch == ' ' or ch == '.':
                continue
            color = palette.get(ch, '#000000')
            rects.append(
                f'<rect x="{x * cell_size}" y="{y * cell_size}" width="{cell_size}" height="{cell_size}" fill="{color}" shape-rendering="crispEdges"/>'
            )
    bg_color = palette.get('bg', '#ffffff')
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
        f'  <rect width="{w}" height="{h}" fill="{bg_color}" shape-rendering="crispEdges"/>\n'
    )
    svg += '\n'.join(f'  {r}' for r in rects)
    svg += '\n</svg>'
    return svg


# --- Portraits: 16x20, cell 8, canvas 128x160 ---

lifeng_grid = [
    "................",
    ".....xxxxxx.....",
    "...xxxxxxxxxx...",
    "..xxxxxxxxxxxx..",
    ".xxxxxxxxxxxxxx.",
    ".xxxssssssssxxx.",
    "..xssssssssssx..",
    "..xsssseesseex..",
    "..xsssseesseex..",
    "..xssssssssssx..",
    "...xssssssssx...",
    "...xsssssssssx..",
    "....ssssssssss..",
    "....sssssssssss.",
    "...ssssssssssss.",
    "..sssssssssssss.",
    "..ssbbbbbbbbss..",
    ".sssbbbbbbbbsss.",
    ".ssbbbbbbbbbbss.",
    "..bbbbbbbbbbbb..",
]

lifeng_palette = {
    'bg': '#7ec4a0',
    'x': '#4a3b2a',  # hair
    's': '#f5cda2',  # skin
    'e': '#3d2b1f',  # eyes
    'b': '#5d8aff',  # shirt
}

chenmo_grid = [
    "................",
    "....xxxxxxxx....",
    "..xxxxxxxxxxxx..",
    ".xxxxxxxxxxxxxx.",
    ".xxxxxxxxxxxxxx.",
    "..xxxxssssxxxx..",
    "..xxxssssssxxx..",
    "...xxssssssxx...",
    "...xxseessexx...",
    "...xxseessexx...",
    "...xxssssssxx...",
    "....xssssssx....",
    "....xssssssx....",
    "...ssssssssss...",
    "..ssssssssssss..",
    ".ssssssssssssss.",
    ".sshhsssssshhss.",
    ".shhhhsssshhhhss",
    ".shhhhhssshhhhhs",
    "..hhhhhhhhhhhh..",
]

chenmo_palette = {
    'bg': '#6b8cae',
    'x': '#2c2c2c',  # hair
    's': '#f5cda2',  # skin
    'e': '#1a1a1a',  # eyes
    'h': '#ff8c42',  # hoodie
}

wangqiming_grid = [
    "................",
    ".....xxxxxx.....",
    "...xxxxxxxxxx...",
    ".xxxxxxxxxxxxxx.",
    ".xxxxxxxxxxxxxx.",
    "..xxxssssssxxx..",
    "..xxssssssssxx..",
    "..xxssssssssxx..",
    "..xxseesseesxx..",
    "..xxseesseesxx..",
    "...xssssssssx...",
    "...xssssssssx...",
    "...xsssssssssx..",
    "..ssssssssssss..",
    ".ssssssssssssss.",
    ".ssssssssssssss.",
    ".ssccssssssccss.",
    ".sccccssssccccss",
    ".sccccccxccccccs",
    "..cccccccccccc..",
]

wangqiming_palette = {
    'bg': '#d4b483',
    'x': '#3d2b1f',  # hair
    's': '#f5cda2',  # skin
    'e': '#2a1d15',  # eyes
    'c': '#c45c48',  # coat
}

portraits = [
    ('lifeng.svg', lifeng_grid, lifeng_palette),
    ('chenmo.svg', chenmo_grid, chenmo_palette),
    ('wangqiming.svg', wangqiming_grid, wangqiming_palette),
]

for filename, grid, palette in portraits:
    svg = svg_from_grid(grid, 8, palette, 128, 160)
    (BASE / 'portraits' / filename).write_text(svg, encoding='utf-8')


# --- Scenes: 40x30, cell 10, canvas 400x300 ---

office_grid = []
# night sky / window background
for _ in range(12):
    office_grid.append("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
# window frames
office_grid[0] = "wwwwwwwwwwwwwwwwwwwwwwwwwwnnnnnnnnnnnnnn"
office_grid[1] = "wbbbbbbbbbbbbbbbbbbbbbbbbwwnnnnnnnnnnnnn"
office_grid[2] = "wbbbbbbbbbyybbbbbbbbbbbbbwwnnnnnnnnnnnnn"
office_grid[3] = "wbbbbbbbbbyybbbbbbbbbbbbbwwnnnnnnnnnnnnn"
office_grid[4] = "wbbbbbbbbbbbbbbbbbbbbbbbbwwnnnnnnnnnnnnn"
office_grid[5] = "wbbbbbbbbbbbbbbbbbbbbbbbbwwnnnnnnnnnnnnn"
office_grid[6] = "wwwwwwwwwwwwwwwwwwwwwwwwwwwnnnnnnnnnnnnn"
office_grid[7] = "wbbbbbbbbbbbbbbbbbbbbbbbbwwnnnnnnnnnnnnn"
office_grid[8] = "wbbbbbbbbbbbbbbbbbbbbbbbbwwnnnnnnnnnnnnn"
office_grid[9] = "wbbbbbbbbbbbbbbbbbbbbbbbbwwnnnnnnnnnnnnn"
office_grid[10] = "wbbbbbbbbbbbbbbbbbbbbbbbbwwnnnnnnnnnnnnn"
office_grid[11] = "wwwwwwwwwwwwwwwwwwwwwwwwwwwnnnnnnnnnnnnn"

# floor / desks area
for _ in range(18):
    office_grid.append("ffffffffffffffffffffffffffffffffffffffff")

# desks
office_grid[14] = "..dddddddddd.......dddddddddd..........."
office_grid[15] = "..dddddddddd.......dddddddddd..........."
office_grid[16] = "..dddddddddd.......dddddddddd..........."
office_grid[17] = "..llllllllll.......llllllllll..........."
office_grid[18] = "..llllllllll.......llllllllll..........."
office_grid[20] = ".............................dddddddddd."
office_grid[21] = ".............................dddddddddd."
office_grid[22] = ".............................dddddddddd."
office_grid[23] = ".............................llllllllll."
office_grid[24] = ".............................llllllllll."

# chairs
office_grid[16] = ".c.ddddddddd.c.....c.ddddddddd.c........"
office_grid[22] = ".............................cdddddddddc"

office_palette = {
    'bg': '#2a2a2a',  # default dark wall
    'n': '#3d3d5c',   # night wall
    'w': '#5c4a3a',   # window frame
    'b': '#1a1a3a',   # night sky
    'y': '#f5e6a8',   # moon
    'f': '#4a3b2a',   # floor
    'd': '#5c4a3a',   # desk
    'l': '#2c2c2c',   # legs/shadow
    'c': '#7ec4a0',   # chair glow accent
    'g': '#7ec4a0',   # glow
}

factory_grid = []
for _ in range(30):
    factory_grid.append("llllllllllllllllllllllllllllllllllllllll")

# ceiling lights
for i in range(2, 38, 6):
    factory_grid[1] = factory_grid[1][:i] + 'y' + factory_grid[1][i+1:]
    factory_grid[2] = factory_grid[2][:i] + 'y' + factory_grid[2][i+1:]

# conveyor belt line
factory_grid[18] = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
factory_grid[19] = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
factory_grid[20] = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"

# phones on belt
for i in range(4, 36, 8):
    for r in range(15, 18):
        factory_grid[r] = factory_grid[r][:i] + 'ppp' + factory_grid[r][i+3:]

# robotic arms
for i in range(7, 38, 12):
    factory_grid[8] = factory_grid[8][:i] + 'aa' + factory_grid[8][i+2:]
    factory_grid[9] = factory_grid[9][:i] + 'aa' + factory_grid[9][i+2:]
    factory_grid[10] = factory_grid[10][:i] + 'aa' + factory_grid[10][i+2:]
    factory_grid[11] = factory_grid[11][:i] + 'aa' + factory_grid[11][i+2:]
    factory_grid[12] = factory_grid[12][:i] + 'aa' + factory_grid[12][i+2:]
    factory_grid[13] = factory_grid[13][:i] + 'hh' + factory_grid[13][i+2:]
    factory_grid[14] = factory_grid[14][:i] + 'hh' + factory_grid[14][i+2:]

factory_palette = {
    'bg': '#e8e4d9',
    'l': '#e8e4d9',  # light wall
    'y': '#ffeb3b',  # light
    'b': '#5a6b7c',  # belt
    'p': '#2c2c2c',  # phone
    'a': '#7a8b9c',  # arm
    'h': '#4a5b6c',  # arm shadow
    'f': '#8a9bac',  # floor
}

# bottom floor
for r in range(21, 30):
    factory_grid[r] = 'ffffffffffffffffffffffffffffffffffffffff'

farm_warehouse_grid = []
for _ in range(30):
    farm_warehouse_grid.append("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")

# ceiling beams
for r in [2, 5, 8]:
    farm_warehouse_grid[r] = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'

# warehouse back wall with windows
for r in range(10, 16):
    row = 'w' * 40
    for i in range(4, 36, 8):
        row = row[:i] + 'yy' + row[i+2:]
    farm_warehouse_grid[r] = row

# floor
for r in range(20, 30):
    farm_warehouse_grid[r] = 'ffffffffffffffffffffffffffffffffffffffff'

# crates and produce
for r in range(21, 27):
    farm_warehouse_grid[r] = farm_warehouse_grid[r][:5] + 'cccccc' + farm_warehouse_grid[r][11:]
    farm_warehouse_grid[r] = farm_warehouse_grid[r][:18] + 'cccccc' + farm_warehouse_grid[r][24:]

# produce dots
farm_warehouse_grid[22] = farm_warehouse_grid[22][:6] + 'gg' + farm_warehouse_grid[22][8:]
farm_warehouse_grid[24] = farm_warehouse_grid[24][:19] + 'oo' + farm_warehouse_grid[24][21:]

# sacks
for i in range(28, 36, 4):
    farm_warehouse_grid[23] = farm_warehouse_grid[23][:i] + 'ss' + farm_warehouse_grid[23][i+2:]
    farm_warehouse_grid[24] = farm_warehouse_grid[24][:i] + 'ss' + farm_warehouse_grid[24][i+2:]

farm_warehouse_palette = {
    'bg': '#d4b483',
    'w': '#c4a473',  # wall
    'b': '#8b6f47',  # beam
    'y': '#f5e6a8',  # window light
    'f': '#a68b5b',  # floor
    'c': '#8b5a2b',  # crate
    'g': '#7ec4a0',  # green produce
    'o': '#ff8c42',  # orange produce
    's': '#f5f5dc',  # sack
}

city_night_grid = []
for _ in range(30):
    city_night_grid.append("ssssssssssssssssssssssssssssssssssssssss")

# stars
for i in [3, 12, 22, 31, 37]:
    city_night_grid[1] = city_night_grid[1][:i] + '*' + city_night_grid[1][i+1:]
    city_night_grid[4] = city_night_grid[4][:i+2] + '*' + city_night_grid[4][i+3:]

# buildings
buildings = [
    (1, 18, 'b'),
    (6, 24, 'd'),
    (12, 20, 'b'),
    (18, 28, 'd'),
    (25, 16, 'b'),
    (30, 22, 'd'),
    (35, 14, 'b'),
]
for x, h, color in buildings:
    for r in range(30 - h, 30):
        row = list(city_night_grid[r])
        for i in range(x, min(x + 5, 40)):
            row[i] = color
        city_night_grid[r] = ''.join(row)

# windows / neon
for x, h, _ in buildings:
    for r in range(30 - h + 2, 30 - 2, 3):
        row = list(city_night_grid[r])
        for i in range(x + 1, min(x + 4, 40)):
            row[i] = 'y'
        city_night_grid[r] = ''.join(row)

# neon signs
for x, h, _ in buildings:
    sign_r = 30 - h + 1
    row = list(city_night_grid[sign_r])
    for i in range(x + 1, min(x + 4, 40)):
        row[i] = 'n'
    city_night_grid[sign_r] = ''.join(row)

# street
for r in range(27, 30):
    city_night_grid[r] = 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'

# street lights
for i in range(4, 40, 10):
    for r in range(25, 27):
        row = list(city_night_grid[r])
        row[i] = 'o'
        city_night_grid[r] = ''.join(row)

city_night_palette = {
    'bg': '#1a1a3a',
    's': '#1a1a3a',  # sky
    '*': '#ffffff',  # stars
    'b': '#2a2a5a',  # building 1
    'd': '#3a3a6a',  # building 2
    'y': '#f5e6a8',  # window light
    'n': '#ff69b4',  # neon
    'r': '#2a2a2a',  # road
    'o': '#ff8c42',  # street light
}

meeting_room_grid = []
for _ in range(30):
    meeting_room_grid.append("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")

# whiteboard / projection screen
for r in range(3, 12):
    row = 'w' * 40
    row = row[:8] + 'bbbbbbbbbbbbbbbbbbbb' + row[28:]
    meeting_room_grid[r] = row

# table
for r in range(18, 25):
    meeting_room_grid[r] = '....tttttttttttttttttttttttttttttttt....'

# people sitting around table
people_positions = [
    (6, 16, 'p'),   # left
    (14, 15, 'p'),  # top
    (22, 15, 'p'),  # top
    (30, 16, 'p'),  # right
]
for x, y, ch in people_positions:
    meeting_room_grid[y] = meeting_room_grid[y][:x] + 'hhh' + meeting_room_grid[y][x+3:]
    meeting_room_grid[y+1] = meeting_room_grid[y+1][:x] + 'sss' + meeting_room_grid[y+1][x+3:]

# chairs
meeting_room_grid[17] = meeting_room_grid[17][:5] + 'cc' + meeting_room_grid[17][7:]
meeting_room_grid[17] = meeting_room_grid[17][:29] + 'cc' + meeting_room_grid[17][31:]

meeting_room_palette = {
    'bg': '#f5f5dc',
    'w': '#f5f5dc',  # wall
    'b': '#ffffff',  # whiteboard
    't': '#8b6f47',  # table
    'p': '#f5cda2',  # people skin
    'h': '#4a3b2a',  # hair
    's': '#5d8aff',  # shirt
    'c': '#7ec4a0',  # chair
    '.': '#f5f5dc',  # floor
}

scenes = [
    ('office.svg', office_grid, office_palette),
    ('factory.svg', factory_grid, factory_palette),
    ('farm_warehouse.svg', farm_warehouse_grid, farm_warehouse_palette),
    ('city_night.svg', city_night_grid, city_night_palette),
    ('meeting_room.svg', meeting_room_grid, meeting_room_palette),
]

for filename, grid, palette in scenes:
    svg = svg_from_grid(grid, 10, palette, 400, 300)
    (BASE / 'scenes' / filename).write_text(svg, encoding='utf-8')

print("Assets generated successfully.")
