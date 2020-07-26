#!/usr/bin/env python
# coding: utf-8
import pandas as pd
from datetime import date, timedelta

df = pd.read_json('COVID19BE_CASES_MUNI.json', encoding='utf-8', orient='records', dtype={'NIS5': str, 'CASES': int})

df.set_index('DATE', inplace=True)
df['CASES'] = pd.to_numeric(df['CASES'], errors='coerce')

def sum_last_days(dataframe, days=14):
    cols = dataframe.columns.to_list()
    cols.remove('CASES')
    end = dataframe.index.max()
    start = end - timedelta(days=(days-1))
    df_sliced = dataframe.loc[start.isoformat():end.isoformat()]
    print(df_sliced)
    df_grouped = df_sliced.groupby(cols, as_index=False).sum()
    return df_grouped

sum_last_days(df, days=7).to_json('COVID19BE_CASES_MUNI_7DAYS.json', orient='records')
sum_last_days(df, days=14).to_json('COVID19BE_CASES_MUNI_14DAYS.json', orient='records')
