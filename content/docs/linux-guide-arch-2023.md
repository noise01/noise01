---
date: 2023-07-01
tags: ["linux", "Arch Linux"]
---

# インストールガイド: Arch Linux (2023 年)

個人用PCのLinux環境を再構築した際のメモ。

## 概要

ローリング・リリースモデルを採用しているLinuxディストリビューションであるArch Linuxは、かつてはインストールが面倒だった。そのためManjaroやEndeavorOSなどのユーザーフレンドリーな派生OSが誕生することになった。しかし、最近では`archinstall`を使うことでパーテイションからデスクトップ環境の構築、RAMの最適化まで一通り行ってくれるようになった。

この記事では、日本語環境で普段使いする際に必要なパッケージのインストールも行う。PCはUEFI環境でNVIDIAのグラフィックボードを積んだ構成を想定している。

大抵の情報はArch Wikiに書いてある。

## インストールメディアの作成

ここではISOファイルをUSBファイルに焼いてインストールに必要なブートメディアの作成を行う。

まず[ダウンロードページ](https://www.archlinux.jp/download/)から ISO ファイルを入手し、以下の方法でインストールメディアを作成する。

- Windowsの場合: Rufus
- Linuxの場合: gnome(+ nautilus)環境ならディスクイメージライターで焼くのが簡単。`dd`コマンドでも可

## インストール

### 起動優先順位の変更

インストールを行うPCに既に何らかのOSがインストールされている場合には、まずインストールメディアを挿した状態で起動優先順位の変更を行う。新規で組んだOSの入っていないPCの場合にはこの手順はスキップする。

使用しているマザーボードにもよるが、起動時に何らかのキー(`F2`や`DEL`キーなど)を押すことでBIOS画面に入ることができる。そこでISOファイルを焼いたUSBを選択してから再起動を行う。

### archinstall

インストールメディアにはArch Linuxを他のデバイスにインストールするために最小限必要なArch Linuxが入っている。

PCを起動することでttyが起動するはずなので、

```bash
root@archiso ~ #
```

のように表示されていれば成功。

はじめに述べたとおり、ここでは`archinstall`というヘルパーライブライを用いることでLinux環境を最低限構築することができる。`archinstall`コマンドを入力すると、以下のような設定項目が表示される。

- Archinstall language
- Keyboard Layout
- Mirror region
- Locale language
- Locale encoding
- Drive(s)
- Disc layout
- Disc encryption
- Bootloader
- Swap
- Hostname
- Root password
- User account
- Profile
- Audio
- Kernels
- Additional packages
- Network configulation
- Timezone
- Automatic time sync (NTP)
- Optional repositories

基本的な操作方法は矢印キーで上下を移動、`Enter`キーで決定、`Esc`キーで戻る。また画面によっては`Ctrl + C`キーでその項目のリセット、`tab`キーで選択(`[ ] -> [*]`)、`/`キーで選択項目の検索を行う。

一通り設定し終えたら`Install`を選択することで、インストールが始まる。完了すると続けて`chroot`でログインするか尋ねられるが、設定したいことが無ければ終了する。`archinstall`が終了して`archiso`の root に戻り、`reboot`でインストールが完了する。

また`Save configuration`これまでの設定を保存しておくことができる。途中で作業を中断する場合には便利かもしれない。

以下で、上記の項目について細かく見ていく。

### Archinstall language

このツールにおける言語設定。2023年現在日本語は用意されていないのでEnglishのままにする。括弧内の%表示は翻訳完了率だと思われる。

### Keyboard layout

キーボードのレイアウトを変更することができる。日本語配列のキーボードを使用している場合には`jp106`を選ぶ。この設定はインストール後もおそらく自動で引き継がれているようだ。

### Mirror region

実際にインストールの際に各種パッケージを取ってくるためのミラーサーバの設定。基本的には近い方がダウンロードが速いのでJapanを選ぶ(複数選択可)。

### Locale language

Linuxの言語設定。`ja_JP.UTF8`を選択する。ロケールを日本語にした場合、ホームディレクトリ内のディレクトリ名が日本語になってしまうデメリットがあるが、ロケールを後で生成するのも手間なのでここでは日本語に設定する。インストール完了後に設定を戻すこともできる。どうせそのうち`en_US`も必要になるためここで生成しておきたかったが、複数選択ができなかったので諦めた。

### Locale encoding

UTF8一択なので特に注意する点はない。

### Drive(s)

実際にLinuxをインストールしたいディスクを選ぶ。どれがどのディスクかは`size`の部分で判断する。

自分はSSD+HDDの構成だったので

- `/dev/sda`: SSD、OSインストール用
- `/dev/sdb`: HDD、データ用
- `/dev/sdc`: インストールメディアのUSB

のようになるため`/dev/sda`を選択した。

### Disc layout

ディスクのパーティション分割の設定を行う。

- Select what to do with each individual drive (followed bu partition usage)
- Wipe all selected drives and use a best-effort default partition layout

の2種類の項目が用意されている。

1つ目はパーティションを手動で分ける。特に、既にパーティションを分けてOSがインストールしていて、再インストールするような場合や、複数のドライブに分けてインストールするような場合にはこちら。

2つ目は自動でパーティション分割を行う。選択しているドライブが1つの場合は`efi`ように512MB確保して、残りをすべてそれ以外に割り当てるというだけの構成になる。

その後、ファイルシステムを選択することになるが、安定している`btrfs`で特に問題はない。続いてのサブボリュームについても同様。最後の圧縮についても有効にしておく。

### Disc encryption

ディスク暗号化に関する設定を行う。インストールするメディアに関して暗号化した場合には、起動時に毎回手入力しなければならないため自分はしなかった。

### Bootloader

ブートローダーで、`systemd-boot`か`GRUB`のどちらを使用するか選択することができる。デフォルトだと新しい`systemd-boot`を使用することになっている。特にこだわりがなければ変更する必要はない。

### Swap

メモリが足りない場合に使用するスワップメモリを確保するかどうかの設定を行う。インストールするディスクに余裕があれば有効にしておく。

### Hostname

ホスト名の設定を行うことができる。しかし、普段使いの場合には気にするタイミングも特にないのでデフォルト名(`archlinux`)で問題はない。

### Root password

基本的には`root`を弄ることがない(`sudo`でなんとかなる)ので、設定する必要はない。しかし、公式Wikiによると、設定することが推奨されているのでお好みで。

### User account

最低でも1つは作成する。

- Add a user: ユーザー名とパスワードを設定する
  - `sudo`権限を有効にする(`no -> yes`)ことでアプリケーションをインストールしたりできるようになる
- Cofirm and exit: 設定を確定させる

### Profile

PCをどのような用途で使用するか選択することができる。今回は普段使いする環境を構築したいので、`desktop`を選択する。その後、好みのデスクトップ環境を選択する。

使用しているGPUに適したグラフィクドライバーを選択する。フリーのものを全てとりあえず入れる選択肢もある。自分はGeForceを使用していたので、表示メッセージに従ってNVIDIAのproprietaryのものを選択した。

### Audio

サウンドサーバーを`pipewire`と`pulseaudio`から選択することができる。特にこだわりがなければ新しい`pipewire`を選んでおけば問題ない。ちなみにSteam(Proton経由)でゲームをする際にも、自分の場合は特に問題は出なかった。

### Kernels

Linuxカーネルの種類を選択する。デフォルトでよい。

### Additional package

インストール完了時に必要なものがあれば追加でインストールすることができる。後でいくらでもインストールできるため、特に設定する必要はないが、ロケールを日本語にしている場合には文字化け対策のために何らかの日本語フォントを入れておくと快適。

### Network configuration

有線や無線のネットワークの管理方法を選択する。gnomeやKDEなどのデスクトップ環境では`NetworkManager`が主流。

### Timezone

タイムゾーンの選択。`Asia/Tokyo`を選択する(`/`で検索するとよい)。

### Automatic time sync (NTP)

自動時刻合わせの設定を行う。特に理由がなければ有効にしておく。

### Optional repositories

パッケージの追加リポジトリを選択することができる。AURが使えると便利なので`multilib`を追加する。

## インストール後

インストール完了後に行う主な設定を列挙しておく。

### 英語ロケールの追加

`archinstall`時には日本語のロケールを選択したが、英語もないとなにかと不便なので設定しておく。

まずは現在のロケールを確認しておく。

```bash
locale -a
```

`en_US.utf8`が無い場合には

```bash
sudo vim /etc/locale.gen
```

で`en_US.utf8`の行をアンコメントする。(逆にインストール時に英語ロケールにしていて日本語ロケールを生成しようとしたら`locale.gen`ファイルが生成されていなかった。)

その後

```bash
sudo locale-gen
```

でロケールが生成され、設定画面の地域と言語で生成した言語が選択できるようになる。ログインし直すことで言語が切り替わる。ホームディレクトリ内のディレクトリの名称も変更するか尋ねられるので好みで変更しても良い。

### フォントのインストール

日本語フォントがデフォルトでは入っていないため、もしインストール時に追加していない場合は、日本語ロケールでは大概文字化けしている。

```bash
pacman -S noto-fonts-cjk
```

各種デスクトップ環境の設定画面からフォントの変更を行っておく。

### パッケージ管理

パッケージ管理を`pacman`から`yay`に切り替える場合には、まず`base-devel`と`git`をインストールする。

```bash
sudo pacman -S base-devel git
```

さらに続けて、

```bash
git clone <https://aur.archlinux.org/yay.git>
cd yay
makepkg -si
```

で`yay`をインストールすることができる。(気になるようであればビルド後は`yay`ディレクトリを消しておく。)

以降は`yay`コマンドでパッケージを管理する。ダウングレード機能を使用するためには

```bash
yay -S downgrade
```

`flatpak`を有効にしても良い。

```bash
yay -S flatpak
```

### bash 関連

bashを好きなようにカスタマイズする。

```bash
yay -S bash-completion
```

好みのshellに変更しても良い。

### テーマ、アイコン

好みのものを入れる。自分はデスクトップ環境を`Budgie(gnome)`にしていたので

```bash
yay -S materia-gtk-theme papirus-icon-theme
```

をインストールし、デスクトップ設定からテーマとアイコンを変更した。

### 壁紙

```bash
yay -S archlinux-wallpaper
```

Arch Linuxをテーマにした壁紙が追加される。~~"I USE ARCH BTW"と書かれた壁紙もある！~~

### ブラウザ

Google Chrome

```bash
yay -S google-chrome
```

### 開発環境

```bash
yay -S code
```

git関連の設定

```bash
git config --global pull.rebase false
git config --global init.defaultBranch main
git config --global user.name [ユーザー名]
git config --global user.emai [メールアドレス]
```

GitHubと連携する際には、通常ssh関連の設定が必要だが、使用エディタがVS Codeの場合は自動的なリポジトリ連携の機能があるため不要なので自分は行わなかった。

### Bluetooth

Bluetoothはデフォルトだと動かなかっので、とりあえず

```bash
yay -S bluez bluez-utils
```

を入れた後、

```bash
systemctl status bluetooth.service
```

を確認し、ステータスが`disable`だった場合には

```bash
systemctl start bluetooth.service
systemctl enable bluetooth.service
```

でアクティブにする。

### 日本語入力

昔は結構面倒だった印象がある。今回は`fcitx`+`mozc`にした。

まず`fcitx`一式をインストールする。

```bash
yay -S fcitx5 fcitx5-im fcitx5-mozc fcitx5-configtool
```

その後`~/.xprofile`に以下を追加する。

```bash
export GTX_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
```

### Steam

```bash
yay -S steam
```

### HHKB(US配列)を日本語配列で使用する

HHKBのUS配列を無理やり日本語で使用する場合、キー数が足りないのでキーマップを変更する必要がある。キーマップを変更するツールも存在するがうまく動かなかったりしたので、設定ファイルを直接書き換える。

```bash
sudo vim /usr/share/X11/xkb/symbols/jp
```

を開いた先頭の方に`xkb_symbols "106"`のブロックがあるのでその中身を変更する。

```plaintext
...
xkb_symbols "106" {
    ...
    key <AE10> { [0, bar] }
    ...
    key <RTSH> { [backslash, underscore] }
};
...
```

具体的には

- `SHIFT + 0`のチルダ(`~`)を縦棒(`|`)に変更(チルダは`SHIFT + ^`でも出せるため)
- 右シフトを潰してバックスラッシュ(`\`)とアンダースコア(`_`)に変更
