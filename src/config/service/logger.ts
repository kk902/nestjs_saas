import { LoggerService } from "@nestjs/common/services";
import { Collection } from "mongoose";
import { WinstonModule, utilities } from "nest-winston";

import { createLogger,format } from 'winston';
import * as winston from 'winston';

import 'winston-daily-rotate-file';
import 'winston-mongodb';

const errType = format((info,ops)=>{
//  console.log(info,ops)
  return info
})

const instance = createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike()
      )
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '5m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp({format:"YYYY-MM-DD hh:mm:ss"}),
        errType(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.MongoDB({
      level:"warn",
      db:process.env.MONGODB_URL,
      collection:"logs",
      options:{
        maxPoolSize: 10,
        minPoolSize: 5,
      },
      format:winston.format.combine(
        winston.format.timestamp({format:"YYYY-MM-DD hh:mm:ss"}),
        winston.format.metadata(),
        winston.format.json()
      ),
    })
  ]
})

export const logger:LoggerService = WinstonModule.createLogger({instance})