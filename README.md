# grafana-json-button

build latest:

```shell
git clone https://github.com/ampx/grafana-json-button
cd grafana-json-button/
yarn install
yarn build
rm -rf coverage/ node_modules/
```

install:

```shell
cd ../
cp -r grafana-json-button/ /var/lib/grafana/plugins/
sudo service grafana-server restart
```
