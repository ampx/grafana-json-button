import { AppEvents, PanelProps } from '@grafana/data';
import {
  getBackendSrv,
  getDataSourceSrv,
  getTemplateSrv,
  SystemJS,
} from '@grafana/runtime';
import { Button, HorizontalGroup, VerticalGroup } from '@grafana/ui';
import React from 'react';
import { ButtonOptions, Options } from 'types';

interface Props extends PanelProps<Options> {}

export const ButtonPanel: React.FC<Props> = ({ options }) => {
  const renderButtons = (buttons: ButtonOptions[]) => {
    return buttons.map((b: ButtonOptions, index: number) => {
      const text = b.text || 'Button';
      return (
        <Button
          key={index}
          variant={b.variant}
          onClick={async () => {
            const payload = JSON.parse(
              await getTemplateSrv().replace(b.query || '{}')
            );
            const ds = await getDataSourceSrv().get(b.datasource);
            try {
              const resp = await getBackendSrv().datasourceRequest({
                method: 'POST',
                url: 'api/datasources/proxy/' + ds.id + '/query',
                data: {
                  targets: [
                    {
                      datasourceId: ds.id,
                      refId: '1',
                      data: {
                        ...payload,
                      },
                    },
                  ],
                },
              });
              const events = await SystemJS.load('app/core/app_events');
              events.emit(AppEvents.alertSuccess, [
                text + ': ' + resp.status + ' (' + resp.statusText + ')',
              ]);
            } catch (error) {
              const events = await SystemJS.load('app/core/app_events');
              events.emit(AppEvents.alertError, [
                text + ': ' + error.status + ' (' + error.statusText + ')',
                error.data.message,
              ]);
            }
          }}
        >
          {text}
        </Button>
      );
    });
  };

  return (
    (options.orientation === 'vertical' && (
      <VerticalGroup justify="center" align="center">
        {renderButtons(options.buttons)}
      </VerticalGroup>
    )) || (
      <HorizontalGroup justify="center" align="center">
        {renderButtons(options.buttons)}
      </HorizontalGroup>
    )
  );
};
