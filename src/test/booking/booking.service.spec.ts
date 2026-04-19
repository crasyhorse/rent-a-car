import HttpException from '@/app/models/HttpException';
import {
    createBooking,
    deleteBookingById,
    getBookingById,
    getBookingsByCarId
} from '@/app/routes/booking/booking.repository';
import * as DB from '@/db/db';
import type { Database } from '@/db/database.model';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('booking.service', () => {
    let databaseMock: Database;

    const expectedBooking = {
        id: '2c51ef95-173b-4e72-9a32-e7c13c361353',
        customerId: '8dd01190-e7c4-44f5-bcff-739565d8ea5a',
        carId: '4ec570ea-3afd-4fad-af60-dad23d4c7d37',
        startDate: '2025-01-18T12:00:00.000Z',
        endDate: '2025-01-25T19:00:00.000Z',
        insuranceId: 'f2e76ffa-8c6c-47ef-bfa8-8aef6e685d1d',
        optionId: '13744176-67c5-4f9e-bf01-204dd95ba3e5',
        price: 901.2
    };

    beforeEach(() => {
        databaseMock = {
            users: [],
            cars: [],
            auth: [],
            bookings: [],
            insurance: [],
            options: []
        };
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('getBookingsByCarId', () => {
        describe('returns', () => {
            it('an array with booking records for the given carId.', async () => {
                // Arrange
                const carId = '4ec570ea-3afd-4fad-af60-dad23d4c7d37';
                databaseMock.bookings.push(expectedBooking);

                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                // Assert
                await expect(
                    getBookingsByCarId(carId)
                ).resolves.toMatchSnapshot();
                expect(readDatabaseSpy).toHaveResolved();
            });

            it('an empty array if there are no bookings for a given car in the database.', async () => {
                // Arrange
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                const carId = '4ec570ea-3afd-4fad-af60-dad23d4c7d37';

                // Assert
                await expect(getBookingsByCarId(carId)).resolves.toEqual([]);
                expect(readDatabaseSpy).toHaveBeenCalled();
            });
        });
    });

    describe('getBookingById', () => {
        describe('returns', () => {
            it('a booking record for the given booking id.', async () => {
                // Arrange
                databaseMock.bookings.push(expectedBooking);
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                // Assert
                await expect(
                    getBookingById('2c51ef95-173b-4e72-9a32-e7c13c361353')
                ).resolves.toMatchSnapshot();
                expect(readDatabaseSpy).toHaveResolved();
            });

            it('undefined if the booking does not exist.', async () => {
                // Arrange
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                // Assert
                await expect(
                    getBookingById('66601190-4711-0815-bcff-739565d8ea5a')
                ).resolves.toBeUndefined();
                expect(readDatabaseSpy).toHaveResolved();
            });
        });
    });

    describe('createBooking', () => {
        it('writes a new booking into the database.', async () => {
            // Arrange
            const readDatabaseSpy = vi
                .spyOn(DB, 'readDatabase')
                .mockResolvedValue(databaseMock);
            const writeDatabaseSpy = vi
                .spyOn(DB, 'writeDatabase')
                .mockResolvedValue(undefined);

            // Act
            await createBooking(expectedBooking);

            // Assert
            expect(readDatabaseSpy).toHaveResolved();
            expect(writeDatabaseSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    bookings: expect.arrayContaining([
                        expect.objectContaining({
                            id: '2c51ef95-173b-4e72-9a32-e7c13c361353',
                            customerId: '8dd01190-e7c4-44f5-bcff-739565d8ea5a',
                            carId: '4ec570ea-3afd-4fad-af60-dad23d4c7d37'
                        })
                    ])
                })
            );
        });

        describe('throws', () => {
            it('Booking id already exists.', async () => {
                // Arrange
                databaseMock.bookings.push(expectedBooking);
                const expected409Error = new HttpException(
                    409,
                    'Booking id already exists.'
                );
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);
                const writeDatabaseSpy = vi.spyOn(DB, 'writeDatabase');

                // Assert
                await expect(createBooking(expectedBooking)).rejects.toThrow(
                    expected409Error
                );
                expect(writeDatabaseSpy).not.toHaveResolved();
                expect(readDatabaseSpy).toHaveResolved();
            });
        });
    });

    describe('deleteBookingById', () => {
        it('removes a booking from the database.', async () => {
            // Arrange
            databaseMock.bookings.push(expectedBooking);
            const readDatabaseSpy = vi
                .spyOn(DB, 'readDatabase')
                .mockResolvedValue(databaseMock);
            const writeDatabaseSpy = vi
                .spyOn(DB, 'writeDatabase')
                .mockResolvedValue(undefined);

            // Act
            await deleteBookingById('2c51ef95-173b-4e72-9a32-e7c13c361353');

            // Assert
            expect(readDatabaseSpy).toHaveResolved();
            expect(writeDatabaseSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    bookings: []
                })
            );
        });

        describe('throws', () => {
            it('Booking could not be found.', async () => {
                // Arrange
                const expected404Error = new HttpException(
                    404,
                    'Booking could not be found.'
                );
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);
                const writeDatabaseSpy = vi.spyOn(DB, 'writeDatabase');

                // Assert
                await expect(
                    deleteBookingById('66601190-4711-0815-bcff-739565d8ea5a')
                ).rejects.toThrow(expected404Error);
                expect(writeDatabaseSpy).not.toHaveResolved();
                expect(readDatabaseSpy).toHaveResolved();
            });
        });
    });
});
