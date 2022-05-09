#!/bin/bash

if [ $# -eq 0 ]; then
  echo 'Must specify command of either extract, validate, or update followed by optional language code'
  exit 1;
fi

if [ "`git rev-parse --show-cdup`" != "" ]; then cd `git rev-parse --show-cdup`; fi

LANGS=("vi" "fr" "en" "zh" "pt" "ru" "pl" "ko" "uk" "es" "de" "it");
if [ $# -eq 2 ]; then
  LANGS=($2);
fi

COMMAND=$1
for CODE in "${LANGS[@]}"
do
  : 
  if [ $COMMAND = "extract" ]; then 
    npm run i18n-extract-$CODE
    grep -v "^#:" assets/i18n/$CODE.po > assets/i18n/temp.po
    mv assets/i18n/temp.po assets/i18n/$CODE.po
  elif [ $COMMAND = "validate" ]; then 
    echo Validating $CODE
    npx ttag validate assets/i18n/$CODE.po
  elif [ $COMMAND = "update" ]; then
    echo Updating Translations for $CODE
    npx ttag po2json assets/i18n/$CODE.po > assets/i18n/$CODE.po.json
  fi
done

