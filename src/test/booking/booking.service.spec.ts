import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readDatabase, writeDatabase } from '@/db/db';
import { Database } from '@/db/database.model';
import { executeBooking } from '@/app/routes/booking/booking.service';
import HttpException from '@/app/models/HttpException';
import { BookingDataInput } from '@/db/booking-data-input.model';

describe('booking.service', () => {
    describe('executeBooking', () => {
        describe('returns', () => {
            let databaseContent: Database;

            beforeEach(async () => {
                const _databaseContent = await readDatabase();
                databaseContent = { ..._databaseContent };
            });

            afterEach(async () => {
                await writeDatabase(databaseContent);
            });
            it('a valid BookingData object.', async () => {
                const booking: BookingDataInput = {
                    userId: '064613d2-1698-49a7-87dd-2cfb03ad35c5',
                    carId: '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37',
                    startDate: new Date('2025-01-02T12:00:00.000Z'),
                    endDate: new Date('2025-01-05T19:00:00.000Z'),
                    insuranceId: '8164aff9-4621-4c9b-a882-b95d54547c0f',
                    optionId: '13744176-67c5-4f9e-bf01-204dd95ba3e5'
                };

                await expect(executeBooking(booking)).resolves.toMatchObject({
                    user: {
                        id: '064613d2-1698-49a7-87dd-2cfb03ad35c5',
                        email: 'hannahappy@example.com',
                        firstName: 'Hanna',
                        lastName: 'Happy',
                        dateOfBirth: '2003-05-27',
                        driversLicense: 'G471GXS0815',
                        address: {
                            street: 'Corbin Ave',
                            houseNumber: '30',
                            zipCode: 'NJ 07306',
                            locality: 'Jersey City'
                        }
                    },
                    car: {
                        id: '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37',
                        brand: 'Rustleaf',
                        name: 'Traveler',
                        class: 'Compact Class',
                        type: 'Station Wagon',
                        seats: '5',
                        automatic: false,
                        dailyRate: 80,
                        imageURL: '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37.jpg'
                    },
                    startDate: new Date('2025-01-02T12:00:00'),
                    endDate: new Date('2025-01-05T19:00:00'),
                    insurance: {
                        id: '8164aff9-4621-4c9b-a882-b95d54547c0f',
                        name: 'Basic insurance',
                        text: 'Excess up to 2.000 €',
                        price: 8.4
                    },
                    option: {
                        id: '13744176-67c5-4f9e-bf01-204dd95ba3e5',
                        name: 'Frequent Drivers',
                        text: 'Includes 1250 kilometers a day (0,63 ct per additional kilometer).',
                        price: 18.65
                    },
                    price: "267.05"
                });
            });
        });

        describe('throws an error', () => {
            let databaseContent: Database;

            beforeEach(async () => {
                const _databaseContent = await readDatabase();
                databaseContent = { ..._databaseContent };
            });

            afterEach(async () => {
                await writeDatabase(databaseContent);
            });
            it('if the given car has already been booked in the given period.', async () => {
                const booking: BookingDataInput = {
                    userId: '064613d2-1698-49a7-87dd-2cfb03ad35c5',
                    carId: '4ec570ea-3afd-4fad-af60-dad23d4c7d37',
                    startDate: new Date('2025-01-02T12:00:00'),
                    endDate: new Date('2025-01-21T19:00:00'),
                    insuranceId: 'b63aecc9-1e5c-44ec-8337-3919c7f6f012',
                    optionId: '13744176-67c5-4f9e-bf01-204dd95ba3e5'
                };

                const expected403Error = new HttpException(
                    403,
                    `This car has already been booked in this period!`
                );

                await expect(executeBooking(booking)).rejects.toThrowError(
                    expected403Error
                );
            });

            it('if startDate is invalid.', async () => {
                const booking: BookingDataInput = {
                    userId: '064613d2-1698-49a7-87dd-2cfb03ad35c5',
                    carId: '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37',
                    startDate: new Date('invalid-date'),
                    endDate: new Date('2025-01-05T19:00:00'),
                    insuranceId: '8164aff9-4621-4c9b-a882-b95d54547c0f',
                    optionId: '13744176-67c5-4f9e-bf01-204dd95ba3e5'
                };

                const expected422Error = new HttpException(
                    422,
                    'Start date or end date is invalid.'
                );

                await expect(executeBooking(booking)).rejects.toThrowError(
                    expected422Error
                );
            });

            it('if startDate is after endDate.', async () => {
                const booking: BookingDataInput = {
                    userId: '064613d2-1698-49a7-87dd-2cfb03ad35c5',
                    carId: '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37',
                    startDate: new Date('2025-01-10T12:00:00'),
                    endDate: new Date('2025-01-05T19:00:00'),
                    insuranceId: '8164aff9-4621-4c9b-a882-b95d54547c0f',
                    optionId: '13744176-67c5-4f9e-bf01-204dd95ba3e5'
                };

                const expected422Error = new HttpException(
                    422,
                    'Start date must be before end date.'
                );

                await expect(executeBooking(booking)).rejects.toThrowError(
                    expected422Error
                );
            });

            it('if the user does not exist.', async () => {
                const booking: BookingDataInput = {
                    userId: 'non-existing-user-id',
                    carId: '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37',
                    startDate: new Date('2025-01-02T12:00:00'),
                    endDate: new Date('2025-01-05T19:00:00'),
                    insuranceId: '8164aff9-4621-4c9b-a882-b95d54547c0f',
                    optionId: '13744176-67c5-4f9e-bf01-204dd95ba3e5'
                };

                const expected422Error = new HttpException(
                    422,
                    'Wrong user id. The user could not be found.'
                );

                await expect(executeBooking(booking)).rejects.toThrowError(
                    expected422Error
                );
            });

            it('if the insurance does not exist.', async () => {
                const booking: BookingDataInput = {
                    userId: '064613d2-1698-49a7-87dd-2cfb03ad35c5',
                    carId: '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37',
                    startDate: new Date('2025-01-02T12:00:00'),
                    endDate: new Date('2025-01-05T19:00:00'),
                    insuranceId: 'non-existing-insurance-id',
                    optionId: '13744176-67c5-4f9e-bf01-204dd95ba3e5'
                };

                const expected422Error = new HttpException(
                    422,
                    'Wrong insurance id. The insurance could not be found.'
                );

                await expect(executeBooking(booking)).rejects.toThrowError(
                    expected422Error
                );
            });
        });
    });
});
