---
date: 2022-07-01
tags: ["C言語"]
---

# C 言語練習: ハノイの塔

再帰関数の練習として、ハノイの塔を実装してみる。

## 概要

基本的な考え方としては

- ある地点にある $(n - 1)$ 段のスタックを別の地点に移動させる
- 元の地点に残っている $n$ 段目を空いている地点に移動させる
- その地点に $(n - 1)$ 段のスタックを移動させる

以上を再起すれば良い。

```c
#include <stdio.h>
#define NUM 4 // 段数

void MoveHanoiStack(int n, int row1, int row2);  // n段の塔をrow1からrow2に移す
void MoveHanoi(int row1, int row2);              // row1の一番上の要素をrow2の一番上に移す
int GetTopIndex(int row);                        // rowの塔の段数を取得する
void PrintHanoi(void);                           // 塔を出力する

int hanoiStacks[3][NUM] = {0};                   // 塔の状態を格納する配列
int stepCnt = 0;

int main(void)
{
  int colIndex = 0;

  /* Initialize */
  for (colIndex = 0; colIndex < NUM; colIndex++)
  {
    hanoiStacks[0][colIndex] = NUM - colIndex;
  }
  PrintHanoi();

  MoveHanoiStack(NUM, 0, 2);
  printf("ステップ数: %d\n", stepCnt);

  return 0;
}

void MoveHanoiStack(int n, int row1, int row2)
{
  if (n == 0)
  {
    return;
  }

  MoveHanoiStack(n - 1, row1, 3 - (row1 + row2));
  MoveHanoi(row1, row2);
  MoveHanoiStack(n - 1, 3 - (row1 + row2), row2);
}

void MoveHanoi(int row1, int row2)
{
  int colIndex1 = 0;
  int colIndex2 = 0;

  printf("%c -> %c\n", 'A' + row1, 'A' + row2);
  stepCnt++;

  colIndex1 = GetTopIndex(row1);
  colIndex2 = GetTopIndex(row2);

  hanoiStacks[row2][colIndex2 + 1] = hanoiStacks[row1][colIndex1];
  hanoiStacks[row1][colIndex1] = 0;

  PrintHanoi();
}

int GetTopIndex(int row)
{
  int colIndex = 0;

  while (hanoiStacks[row][colIndex] != 0)
  {
    colIndex++;
  }

  return colIndex - 1;
}

void PrintHanoi()
{
  int rowIndex = 0;
  int colIndex = 0;

  for (rowIndex = 0; rowIndex < 3; rowIndex++)
  {
    printf("%c:", 'A' + rowIndex);
    for (colIndex = 0; colIndex < NUM; colIndex++)
    {
      printf(" %2d", hanoiStacks[rowIndex][colIndex]);
    }
    printf("\n");
  }
  printf("\n");
}
```

コードの説明としては

- `hanoiStacks[3][]`: 塔の状態を格納する配列
- `MoveHanoiStack()`: 第 1 引数で段数を受け取り、第 2 引数と第 3 引数はそれぞれ移動元と移動先を受け取り、再帰させている
- `MoveHanoi()`: $n$ 段目のみを移動させる

## おまけ

ちなみに、手順だけを表示させる場合には塔の状態を記憶する必要がないため、もっと短いコードで済む。

```c
#include <stdio.h>
#define NUM 10  // 段数

void MoveHanoiStack(int n, int row1, int row2);  // n段の塔をrow1からrow2に移す

int stepCnt = 0;

int main(void)
{
  MoveHanoiStack(NUM, 0, 2);
  printf("ステップ数: %d\n", stepCnt);

  return 0;
}

void MoveHanoiStack(int n, int row1, int row2)
{
  if (n == 0)
  {
    return;
  }

  MoveHanoiStack(n - 1, row1, 3 - (row1 + row2));
  printf("%c -> %c\n", 'A' + row1, 'A' + row2);
  stepCnt++;
  MoveHanoiStack(n - 1, 3 - (row1 + row2), row2);
}
```
