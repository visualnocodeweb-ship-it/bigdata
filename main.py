import pandas as pd

csv_file_path = 'lagos_del_sur.csv'

try:
    df = pd.read_csv(csv_file_path)
    num_rows = len(df)
    print(f"El archivo '{csv_file_path}' tiene {num_rows} filas.")
except FileNotFoundError:
    print(f"Error: No se encontr el archivo '{csv_file_path}'.")
except Exception as e:
    print(f"Ocurri un error: {e}")