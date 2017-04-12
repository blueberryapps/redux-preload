# XXX

<!-- START RENAME -->
# Create new package

```
git clone git@github.com:blueberryapps/js-package-template.git new-package-name
cd new-package-name
yarn rename new-package-name
```
<!-- END RENAME -->

## Development

```
yarn install
yarn eslint
yarn eslint:fix
yarn test
```

## CI and autopublish

On Circle CI you need to add `NPM_TOKEN` which has rights to publish package to npmjs.org.

Also when you provide `SLACK_TOKENS` XXX/YYY/ZZZZ
(take them as one string from url `https://hooks.slack.com/services/XXX/YYY/ZZZ`)
it will let you know about new version.

When code gets to master branch, it will try to publish,
so if version in package.json is different, it will push it automatically.

## Made with love by
[![](https://camo.githubusercontent.com/d88ee6842f3ff2be96d11488aa0d878793aa67cd/68747470733a2f2f7777772e676f6f676c652e636f6d2f612f626c75656265727279617070732e636f6d2f696d616765732f6c6f676f2e676966)](https://www.blueberry.io)
