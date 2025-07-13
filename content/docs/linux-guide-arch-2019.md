---
date: 2019-05-01
tags: ["linux", "Arch Linux"]
---

# インストールガイド: Arch Linux (2019 年)

趣味で個人PCにArch Linuxを入れることにしたときのメモ。

## 概要

全てのことは[Arch Wiki](https://wiki.archlinux.jp/index.php/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8)に書いてあるのだが、自分のような初心者には全く優しくなかったため、今後の試行錯誤の手間を省く目的で作った。

追記: 現在では`archinstall`というライブラリがあるので、そちらでインストールする方が簡単。

## 環境

UEFI環境を想定している。デュアルブートや仮想環境の構築は扱わない。

### ブート用のUSBの作成

Windowsなら`Rufus`を用いることで簡単にブートディスクを作成することができる。パーティション構成はGPT。

## 手順

### ブートディスク起動

ブート用のUSBを差し込んでから起動する。BIOSに入ってUSBから優先的に起動するようにする。

色々文字が流れた後、

```bash
[root@archiso ~] #
```

みたいな画面になれば成功。

### キーボードレイアウト変更、ping確認

初期設定では当然のようにキーボードが英語レイアウトになっているため、気に食わなければ変更してもよい。

```bash
loadkeys jp106
```

ただし、有効なのは起動ディスク上での話であり、OSをインストールした後は再び設定が必要になる。

次にpingを確認する。一番初めに確認することではないと思われるかもしれないが、後でパッケージをインストールする際にネットワーク接続が必要になり、一からやり直しなうえ、インストール中はその辺が非常にシビアになってくるので注意する。そもそも有線接続で繋がらないことは~~多分~~ないのだが、筆者の家では部屋の関係上無線で中継させてそこから`ethernet`による有線接続をしているため調子が悪いみたいなことが起こったりする。無線内臓PCのことは知らん。

まず

```bash
ping archlinux.jp
```

などと打ち込んでみて、なんらかのパケットが返ってきているようであればよいが、明らかに反応がない場合は調子が良くなるまで再起動するか、おまじないとして以下を試す。最初に

```bash
ip link
```

と打ち込んで`lo`以外のインターフェイス名を確認する。もし`DOWN`ならば

```bash
ip link set [インターフェイス名] up
```

その後

```bash
systemctl status dhcpcd@[インターフェイス名].service
```

を入れて`Active`が`failed`であることを確認(`active`なら問題はない)

```bash
systemctl start dhcpcd@[インターフェイス名].service
```

を打ち込んでしばらく待ち、その後pingを試す。
帰ってこなければ再起動する。

### パーティショニング、マウント

次にディスクの状況を確認する。

```bash
lsblk
```

と打ち込むことで接続されているドライブの状況を確認することができる。`sda`がこれからOSをインストールするSSDなりHDDになる。`sdb`には差し込んでいるUSB情報が書いてある。

`sda`をこれからパーティションに分けていくが、その前に念のためブートモードがUEFIであることを確認しておく。

```bash
efivar -l
```

実行結果が返ってくれば問題はない。

UEFIではパーティションは`gdisk`で行う。スクリプトで書ける`sgdisk`というイカしたツールもあるようだがここでは`gdisk`を使う。SSD(HDD)が割り当てられている`sda`をパーティショニングしていく。

```bash
gdisk /dev/sda
```

と打ち込むと何をしたいか聞かれる。

パーティションの分け方は個人の好みだが、最低限ブートに必要なUEFI用のパーティション(後で`/mnt/boot/`にマウントする)とその他(`/mnt/`にマウントし、最終的にはこれが`root`ディレクトリ`/`になる)が必要になる。好みでその他の部分を分ける。

`?`コマンドでいろいろ教えてくれる。よく使いそうなのは、

- `o`: パーティションの仕切り直し。ミスったらこれでやり直す。
- `n`: 新しいパーティションを作る。
- `p`: 作ったパーティションがどうなっているか教えてくれる。
- `w`: 作ったパーティションを実際に分ける。
- `q`: 何もせずそっ閉じ。

とりあえず`o`で初期化しておく。`Proceed`には`Y`で答える。

再び`Command`を聞かれるので、今度は`n`で新しいパーティションを作成する。この際の`Partition number`は`Enter`でデフォルトの`1`でよい。

`lsblk`コマンドでパーティションが分けられていることが確認できる。

問題がなければ、パーティションをフォーマットする。`sda1`に割り当てたUEFI用のパーティションは`FAT32`形式でフォーマットすることになっている。`sda2`は`ext4`フォーマットしておく。

```bash
mkfs.fat -F32 /dev/sda1
mkfs.ext4 /dev/sda2
```

`Proceed anyway?`とか聞かれたら`y`で答えてからしばらく待つとフォーマットが完了する。その後作ったファイルシステムをディレクトリに以下のようにマウントする。

```bash
mount /dev/sda2 /mnt
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot
```

確認するには、

```bash
mount | grep /mnt
```

間違った場合は、

```bash
unmount -R /mnt
```

でやり直す。

### パッケージのダウンロード

まずミラーリストを更新する。パッケージを管理するツールである`pacman`がどのサーバからパッケージを取得するか

```bash
vim /etc/pacman.d/mirrorlist
```

で編集する。Japanを上に持ってきたり、他のサーバを追加するとよい。

```bash
## Japan
Server = <http://ftp.tsukuba.wide.ad.jp/Linux/archlinux/$repo/os/$arch>
## Japan
Server = <http://ftp.jaist.ac.jp/pub/Linux/ArchLinux/$repo/os/$arch>

......
```

その後、`pacstrap`コマンドで必要なパッケージ(`base`、`base-devel`)をインストールする。

```bash
pacstrap /mnt base base-devel
```

### その他 (ブートローダーなど)

`fstab`作成

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

- `U`はUUID

```bash
vim /mnt/etc/fstab
```

で確認できる。

`locale`やタイムゾーンなどは後回しにしてブートローダを設定する。`grub`と`systemd-boot`が存在するがここでは新しい後者を扱う。

```bash
arch-chroot /mnt
```

`systemd-boot`をインストールする。

```bash
bootctl install
```

ローダーを設定する。その前に`chroot`では`vi`しか使えなかったので`vim`をインストールしても良いかもしれない。

```bash
pacman -S vim
```

そのあと`loader.conf`ファイルを編集する。

```bash
vim /boot/loader/loader.conf
```

```bash
default arch
timeout 3
editor no
```

ローダーのエントリーファイルを作成する。

```bash
ls /boot/vmlinuz-linux | sed s~/boot~~ > /boot/loader/entries/arch.conf
ls /boot/initramfs-linux.img | sed s~/boot~~ >> /boot/loader/entries/arch.conf
blkid -o export /dev/sda2 | grep ^UUID >> /boot/loader/entries/arch.conf
```

これにより必要な情報がとりあえず`arch.conf`の中に入る。書き込まれた情報をもとにさらに編集する。

その前にintelのcpuの場合には`intel-ucode`をインストールする。

```bash
pacman -S intel-ucode
```

```bash
vim /boot/loader/entries/arch.conf
```

```bash
title Arch Linux
linux /vmlinuz-linux
initrd /intel-ucode.img
initrd /initramfs-linux.img
options root=UUID=*******-****-****-************ rw
```

ここで特に重要なことは`options`に`root=`と`rw`を追加することである。

```bash
bootctl list
```

### 終わったら

`chroot`を終了する。

```bash
exit
```

その後

```bash
shutdown -h now
```

を入力しシャットダウンする。USBを抜いてから再び起動させれば完成である。
