import { z } from 'zod';

export const newPartySchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(64, { message: 'Name can not be longer than 64 characters' }),
	accountId: z.number().min(1, { message: 'Account is required' }),
	email: z.string().email().optional(),
	phone: z
		.string()
		.min(10, { message: 'Please enter a valid phone number' })
		.max(64, { message: 'Phone number can not be longer than 64 characters' })
		.optional(),
	address: z
		.string()
		.max(1024, { message: 'Address can not be longer than 1024 characters' })
		.optional(),
	city: z
		.string()
		.max(64, { message: 'City name can not be longer than 64 characters' })
		.optional(),
	district: z
		.string()
		.max(64, { message: 'DIstrict name can not be longer than 64 characters' })
		.optional(),
	state: z
		.string()
		.max(64, { message: 'State name can not be longer than 64 characters' })
		.optional(),
	postalCode: z
		.string()
		.max(32, { message: 'Postal Code can not be longer than 64 characters' })
		.optional(),
	taxationId: z
		.string()
		.max(64, { message: 'Taxation ID can not be longer than 64 characters' })
		.optional()
});
