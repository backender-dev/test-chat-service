import { EMessageType } from '@app/common/enums/message-type.enum';
import * as Joi from 'joi';

export const messageSchema = Joi.object({
  id: Joi.string().required(),
  dialogId: Joi.string().required(),
  senderId: Joi.string().required(),
  createdAt: Joi.number().required(),
  type: Joi.string()
    .valid(...Object.values(EMessageType))
    .required(),
  delivered: Joi.boolean().required(),
  content: Joi.when('type', {
    is: EMessageType.TEXT,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  imageUrl: Joi.when('type', {
    is: EMessageType.IMAGE,
    then: Joi.string().uri().required(),
    otherwise: Joi.forbidden(),
  }),
  caption: Joi.when('type', {
    is: EMessageType.IMAGE,
    then: Joi.string().optional(),
    otherwise: Joi.forbidden(),
  }),
  videoUrl: Joi.when('type', {
    is: EMessageType.VIDEO,
    then: Joi.string().uri().required(),
    otherwise: Joi.forbidden(),
  }),
  duration: Joi.when('type', {
    is: EMessageType.VIDEO,
    then: Joi.number().min(0).required(),
    otherwise: Joi.forbidden(),
  }),
  thumbnailUrl: Joi.when('type', {
    is: EMessageType.VIDEO,
    then: Joi.string().uri().required(),
    otherwise: Joi.forbidden(),
  }),
});
