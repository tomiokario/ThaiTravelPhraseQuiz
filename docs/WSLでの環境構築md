
# 概要
以下は、**WSL(Ubuntu)環境** で **Node.js** と **create-react-app** を最短でセットアップして React プロジェクトを作成するための手順をまとめたものです。  
本手順では、既に別の方法 (apt など) でインストールした Node.js がある場合でも、**nvm (Node Version Manager)** を使ってバージョンを管理する方法に統一しています。  

1. **curl と build-essential をインストール**: `sudo apt update && sudo apt install -y curl build-essential`  
2. **Node.js(aptなど) を削除 (必要な場合のみ)**: `sudo apt remove nodejs npm`  
3. **nvm のインストール**:  
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   source ~/.bashrc
   ```  
4. **nvm を使って Node.js をインストール**  
   - LTS:  
     ```bash
     nvm install --lts
     nvm use --lts
     ```
   - バージョン指定例:  
     ```bash
     nvm install 16.15.0
     nvm use 16.15.0
     ```
5. **create-react-app でプロジェクト作成**:  
   ```bash
   npx create-react-app my-react-app
   ```
6. **アプリ起動**:  
   ```bash
   cd my-react-app
   npm start
   ```

この手順に従えば、**「npm error code ERR_INVALID_URL」などのエラー** や Node.js バージョンの競合を避けて、スムーズに React プロジェクトを作成できます。  

# WSL(Ubuntu)で Node.js + create-react-app を行うまでの環境構築
## 1. 必要パッケージのインストール
まず、WSL(Ubuntu) 上で以下を実行し、基本的な開発ツールをインストールします。

```bash
sudo apt update && sudo apt install -y curl build-essential
```

- **curl**: 後ほど nvm をダウンロードするのに使用  
- **build-essential**: npm パッケージのビルド時によく利用される  

## 2. 既存の Node.js をアンインストール (必要な場合のみ)
もし apt などで既に Node.js をインストールしている場合、競合を避けるために削除します。

```bash
sudo apt remove nodejs npm
```

npm のみインストールしていた場合も同様に削除します。

## 3. nvm の導入
WSL のユーザー環境に **nvm** (Node Version Manager) をインストールします。

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

インストール完了後、次のコマンドを実行し、nvm コマンドを使えるようにします。

```bash
source ~/.bashrc
```


## 4. Node.js のインストール
nvm を使って使用したいバージョンの Node.js をインストールします。  
ここでは例として **LTS** バージョン、または **16.15.0** をインストールする例を示します。

### 4-1. 最新の LTS をインストールする場合
```bash
nvm install --lts
nvm use --lts
```

### 4-2. バージョンを指定してインストールする場合
```bash
nvm install 16.15.0
nvm use 16.15.0
```

> `nvm install <バージョン>` で指定した Node.js がインストールされ、  
> `nvm use <バージョン>` でそのバージョンをアクティブ化します。  

インストール後、下記コマンドでバージョンが正しく切り替わっているか確認してください。

```bash
node -v   # v16.15.0 など指定バージョンが表示されればOK
npm -v    # 8.x系などが表示されればOK
```

## 5. create-react-app の実行
**create-react-app** は、`npm` や `npx` を使って簡単に React プロジェクトのテンプレートを作成できるコマンドです。

### 5-1. npx で直接実行する場合
```bash
npx create-react-app my-react-app
```
`my-react-app` の部分は好きなプロジェクト名に置き換えてください。

もし何らかのエラーが表示される場合には、`npm cache clean --force` を実行してキャッシュをクリアしてから再度お試しください。

### 5-2. npm init 形式を使う場合
```bash
npm init react-app my-react-app
```
または
```bash
npm create react-app@latest my-react-app
```
こちらも同様にプロジェクトが作成されます。

## 6. 開発サーバーの起動
プロジェクトの作成が完了したら、ディレクトリに移動して開発サーバーを起動します。

```bash
cd my-react-app
npm start
```

ブラウザで `http://localhost:3000` を開けば、React アプリが立ち上がっていることを確認できます。