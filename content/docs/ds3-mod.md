---
date: 2022-10-01
tags: ["ゲーム", "ダークソウル3"]
---

# ダークソウル3: MOD紹介

ダークソウル3で導入しておくと便利なMOD紹介、自分が使用した範囲だとBANにはならなかった。

## Blue Sentinel

ダークソウル3の代表的なアンチチートMODであるBlue Sentinelの導入方法と使い方を解説する。Ver.2から`dinput8.dll`を使用するようになったため、Protonでも正常に動作するようになった。

主な機能としては、マルチセッション中の不正なデータ受信を防いだり、参加しているプレイヤーのステータス異常やチート行為グリッチを検出できる。さらにチートを使用したSteamアカウントのファミリーアカウントにも自動でフラグを立てて自動的にブロックしてくれる。また、セーブデータのバックアップ機能やping値測定の機能などもある。特にパリィマンにとってはこのping値測定が非常に便利。

nexusmodsからファイル一式をダウンロードし、`README`ファイルに従ってファイルを適切なディレクトリに配置する。

Link: [Blue Sentinel](https://www.nexusmods.com/darksouls3/mods/723)

## Honest Merchant

あらゆる装備、アイテム、指輪などが購入可能になる MOD。Protonでも問題無く動作する。

女神の祝福やジーク酒、原盤などがいくらでも手に入るがオンラインでも特にBANされることはない。ただし、DLC1と2の導入が必須であり、読み込まれていない状態でDLC専用スペルを購入しているとBANの可能性があるらしい。

Nexus Modsの([ページ](https://www.nexusmods.com/darksouls3/mods/607))からダウンロードしたファイルを解凍し、`HonestMerchant.dll`と`honestMerchant.ini`を`DarkSoulsIII.exe`と同じディレクトリ(Steam のライブラリのタイトルを右クリック -> 管理 -> ローカルファイルを閲覧)に配置する。その後、`HonestMerchant.dll`のファイル名を`dinput8.dll`に変更する。もし他の Mod 等を導入していて`dinput8.dll`が重複した場合には適当に名前を変更(例えば`otherMod.dll`)して`honestMerchant.ini`の最後の行に`dll=otherMod.dll`として追加するか、LazyLoader 系のツールを用いて対応する。Linux系OSでProtonを使用している場合にはSteamの起動オプションとして以下を追加する。

```bash
WINEDLLOVERRIDES="dinput8.dll=n,b" %command%
```

具体的な使い方としては、祭祀場の塔入口左側にある死体の前で以下のジェスチャーによって対応する機能にアクセスすることができる。

- 下を指差す (Point Down): アイテム、魔法、指輪
- 上を指差す (Point Up): 武器
- 手をふる (Wave): 防具
- 一礼 (Bow): 武器の変質 (各種種火で開放していなくても変質強化が可能になる)

また、`honestMerchant.ini`を弄ってフラグを変更することで更に以下の機能が使用可能になる。

- 前を指さす (Point Forward): 能力の生まれ変わり
- 休息 (Rest): 外見の生まれ変わり
- 歓喜 (Joy): 不死の闘技
