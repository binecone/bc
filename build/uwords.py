import pandas as pd
import re

# CSV 파일 읽기
df = pd.read_csv('grocery_products.csv')

# 모든 텍스트를 하나의 문자열로 결합
text = ' '.join(df.values.astype(str).flatten())

# 숫자가 없는 단어 찾기
words = re.findall(r'\b[a-zA-Z]+\b', text)

# 유니크한 단어 찾기
unique_words = list(set(words))

# 처음 1000개의 유니크한 단어 출력
print(unique_words[:1000])