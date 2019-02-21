const { homedir } = require('os')
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')

const plugins = [
  'storyn26383/vim-vue',
  'scrooloose/nerdtree',
  'scrooloose/syntastic',
  'scrooloose/nerdcommenter',
  'tpope/vim-surround',
  'airblade/vim-gitgutter',
  'bling/vim-airline',
  'vim-airline/vim-airline-themes',
  'zhaocai/goldenview.vim',
  'mattn/webapi-vim',
  'mattn/gist-vim',
  'pangloss/vim-javascript',
  'ctrlpvim/ctrlp.vim',
  'rking/ag.vim',
  'altercation/vim-colors-solarized',
  'tomasr/molokai',
  'MarcWeber/vim-addon-mw-utils',
  'tomtom/tlib_vim',
  'isRuslan/vim-es6',
  'jiangmiao/auto-pairs',
  'shougo/deoplete.nvim',
  'mxw/vim-jsx',
  'tpope/vim-repeat',
  'svermeulen/vim-easyclip',
  'ryanoasis/vim-devicons',
  'tpope/vim-fugitive',
  'leafgarland/typescript-vim',
  'iamcco/markdown-preview.vim',
  'prettier/vim-prettier'
]

module.exports = class extends Generator {
  initializing() {
    this.config.save()
  }
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the good ' +
          chalk.red('vim config') +
          ' generator!'
      )
    )

    const prompts = [
      {
        type: 'list',
        name: 'distro',
        message: 'Which vim distribution do you use?',
        choices: ['vim', 'neovim']
      },
      {
        type: 'checkbox',
        name: 'plugins',
        message: 'Select plugins you would like to install',
        choices: plugins
      }
    ]

    this.props = await this.prompt(prompts)
  }

  writing() {
    this.destinationRoot(homedir())
    if (this.props.distro === 'vim') {
      this.file = '.vimrc'
    } else {
      this.file = `.config/nvim/init.vim`
    }
    const filePath = `${homedir()}/${this.file}`
    console.log(chalk.yellow('Backing up any old configs...'))
    this.fs.copy(filePath, filePath + '.bak')
    console.log(
      chalk.green(
        `Succesfully backed up to ${filePath + '.bak'}`
      )
    )
    this.fs.copyTpl(
      this.templatePath(`vimrc`),
      this.destinationPath(this.file),
      { ...this.props }
    )
  }

  setInstallOpts() {
    if (this.props.distro === 'vim') {
      this.cloneRepo =
        'https://github.com/VundleVim/Vundle.vim.git'
      this.clonePath = `${homedir()}/.vim/bundle/Vundle.vim`
      this.installCmd = 'vim'
      this.installArgs = ['+PluginInstall', '+qall']
    } else {
      this.cloneRepo = 'https://github.com/Shougo/neobundle.vim'
      this.clonePath = `${homedir()}/.vim/bundle/neobundle.vim`
      this.installCmd = 'nvim'
      this.installArgs = ['+NeoBundleInstall', '+qall']
    }
  }

  install() {
    this.setInstallOpts()

    this.spawnCommandSync(
      `git clone -f ${this.cloneRepo} ${this.clonePath}`
    )
    this.spawnCommand(this.installCmd, this.installArgs, {
      shell: true,
      cwd: homedir()
    })
  }
}
