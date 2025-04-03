import { applyDecorators } from '@nestjs/common';
import { Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Page } from '../types';

export const ApiOkResponsePaginated = <
  DataDto extends Type<unknown>,
  PageType extends Page<unknown>,
>(
  dataDto: DataDto,
  PageClass: { new (): PageType } = Page as any,
) =>
  applyDecorators(
    ApiExtraModels(PageClass, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(PageClass),
          },
          {
            properties: {
              list: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(dataDto),
                },
              },
            },
          },
        ],
      },
    }),
  );
