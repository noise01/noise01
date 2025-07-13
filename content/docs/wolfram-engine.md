---
date: 2025-07-01
tags: ["Mathematica"]
---

# Wolfram Engine 導入

Mathematica のコア部分である Wolfram Engine が無料化したので、Linux に入れようとした際のメモ。

## はじめに

Manjaro Linux を使用しているので、AUR に運良くあったものを使おうとしたのだが、Wolfram 関連のパッケージのインストールに軒並み失敗したため、おとなしくソースコードをコンパイルするしかなかった。途中で deb か rpm 形式でしか配布されていないパッケージを使用するため debtap などを用いて変換するなどの~~面倒な~~作業が必要。

必要なファイルとしては

- Wolfram Engine 本体
- Wolfram Script

の2つ。

## 手順

まず Wolfram のアカウントを作成した後、
[ダウンロードページ](https://www.wolfram.com/engine/)から落とした`.sh`ファイルを以下のコマンドでコンパイルする。

```bash
sudo bash ~/Downloads/WolframEngine_x.x.x_LINUX.sh
```

次にWolfram Scriptをインストールするのだが、公式ページからは`deb`か`rpm`形式しかダウンロードできないため、Manjaro(Arch) linux などを使っている場合には、debtap で変換した`.pkg.tar.zst`ファイルを適当なパッケージマネージャーを使ってインストールを行う。

次に

```bash
wolframscript -activate

Wolfram ID: "Wolfram アカウントに登録したメールアドレス"
Password: "同じくパスワード"
```

でアクティベートを行う。
確認として

```bash
wolfram script --code 1 + 1
```

などを試してみる。
