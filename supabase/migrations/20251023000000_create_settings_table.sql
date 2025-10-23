-- Create settings table to store company/accounting year settings
create table
  public.company_settings (
    id uuid default gen_random_uuid() primary key,
    company_id uuid not null references public.companies(id) on delete cascade,

    -- Accounting year settings
    accounting_year_start date null,
    accounting_year_end date null,
    accounting_year_closed boolean default false,

    -- Club information
    club_name text null,
    club_address text null,
    club_city text null,
    club_postal_code text null,
    club_phone text null,
    club_email text null,

    -- Default accounts
    default_bank_account text null,
    default_cash_account text null,
    default_result_account text null,

    -- Timestamps
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    -- Ensure one settings record per company
    constraint unique_company_settings unique (company_id)
  ) tablespace pg_default;

-- Create index on company_id for faster lookups
create index idx_company_settings_company_id on public.company_settings(company_id);

-- Enable Row Level Security
alter table public.company_settings enable row level security;

-- Create policy to allow users to access settings for their own companies
create policy "Users can view settings for their companies"
  on public.company_settings
  for select
  using (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
    )
  );

create policy "Users can insert settings for their companies"
  on public.company_settings
  for insert
  with check (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
    )
  );

create policy "Users can update settings for their companies"
  on public.company_settings
  for update
  using (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
    )
  );

create policy "Users can delete settings for their companies"
  on public.company_settings
  for delete
  using (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
    )
  );
