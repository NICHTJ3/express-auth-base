#!/bin/sh
set -e
function attachOrSwitch(){
  if [[ $TMUX ]];then
    tmux switch-client -t express-auth-base$1
  else
    tmux attach -t express-auth-base$1
  fi
}

# Attach to the session if it already exists
if tmux has-session -t=express-auth-base 2> /dev/null; then
  attachOrSwitch; exit
fi

# Create a new session with the first window being called vim
tmux new-session -d -s express-auth-base -n vim -x 191 -y 42

# 1. Main window: vim
tmux send-keys -t express-auth-base:vim "nvim -c Files" Enter

# 2. Create a second window to run docker-compose
tmux new-window -t express-auth-base -c $PWD -n Docker
tmux send-keys -t express-auth-base:Docker "docker-compose up" Enter

# Attach to the newly created session
attachOrSwitch :vim.left

