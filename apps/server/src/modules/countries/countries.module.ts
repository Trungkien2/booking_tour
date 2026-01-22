import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';

/**
 * Module for countries-related functionality.
 * Provides endpoints for getting countries list with dial codes.
 */
@Module({
  controllers: [CountriesController],
})
export class CountriesModule {}
