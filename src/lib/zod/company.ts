import { z } from 'zod';

export const newCompanySchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Company name is required' })
		.max(64, { message: 'Company name can not be longer than 64 characters' }),
	financilaYearStart: z
		.string()
		.date()
		.default(new Date().getFullYear() + '-04-01'),
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
	taxationtype: z
		.enum(['GST', 'SALES', 'VAT'], { message: 'Please select an option' })
		.default('' as 'GST')
		.optional(),
	taxationId: z
		.string()
		.max(64, { message: 'Taxation ID can not be longer than 64 characters' })
		.optional()
});
