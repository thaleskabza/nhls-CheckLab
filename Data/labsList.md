CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO labs (id, name) VALUES
-- GAUTENG
(gen_random_uuid(), 'NHLS – Charlotte Maxeke Johannesburg Academic Hospital Lab'),
(gen_random_uuid(), 'NHLS – Chris Hani Baragwanath Academic Hospital Lab'),
(gen_random_uuid(), 'NHLS – Steve Biko Academic Hospital (Tshwane Academic Division) Lab'),
(gen_random_uuid(), 'NHLS – Dr George Mukhari Academic Hospital Lab'),
(gen_random_uuid(), 'NHLS – Kalafong Provincial Tertiary Hospital Lab'),
(gen_random_uuid(), 'NHLS – Tembisa Provincial Tertiary Hospital Lab'),
(gen_random_uuid(), 'NHLS – Helen Joseph Hospital Lab'),
(gen_random_uuid(), 'NHLS – Rahima Moosa Mother and Child Hospital Lab'),
(gen_random_uuid(), 'NHLS – Leratong Hospital Lab'),
(gen_random_uuid(), 'NHLS – Thelle Mogoerane Regional Hospital Lab'),
(gen_random_uuid(), 'NHLS – Pholosong Hospital Lab'),
(gen_random_uuid(), 'NHLS – South Rand Hospital Lab'),
(gen_random_uuid(), 'NHLS – Mamelodi Regional Hospital Lab'),

-- WESTERN CAPE
(gen_random_uuid(), 'NHLS – Groote Schuur Hospital Lab'),
(gen_random_uuid(), 'NHLS – Tygerberg Hospital Lab'),
(gen_random_uuid(), 'NHLS – Red Cross War Memorial Children’s Hospital Lab'),
(gen_random_uuid(), 'NHLS – Mitchells Plain Hospital Lab'),
(gen_random_uuid(), 'NHLS – Khayelitsha District Hospital Lab'),
(gen_random_uuid(), 'NHLS – Paarl Hospital Lab'),
(gen_random_uuid(), 'NHLS – Worcester Hospital Lab'),
(gen_random_uuid(), 'NHLS – George Hospital Lab'),

-- KWAZULU-NATAL
(gen_random_uuid(), 'NHLS – Inkosi Albert Luthuli Central Hospital Lab'),
(gen_random_uuid(), 'NHLS – King Edward VIII Hospital Lab'),
(gen_random_uuid(), 'NHLS – Addington Hospital Lab'),
(gen_random_uuid(), 'NHLS – Prince Mshiyeni Memorial Hospital Lab'),
(gen_random_uuid(), 'NHLS – RK Khan Hospital Lab'),
(gen_random_uuid(), 'NHLS – Greys Hospital Lab'),
(gen_random_uuid(), 'NHLS – Edendale Hospital Lab'),
(gen_random_uuid(), 'NHLS – Northdale Hospital Lab'),
(gen_random_uuid(), 'NHLS – Ngwelezane Hospital Lab'),
(gen_random_uuid(), 'NHLS – Madadeni Hospital Lab'),
(gen_random_uuid(), 'NHLS – Newcastle Hospital Lab'),
(gen_random_uuid(), 'NHLS – Ladysmith Hospital Lab'),
(gen_random_uuid(), 'NHLS – Dundee Hospital Lab'),
(gen_random_uuid(), 'NHLS – Port Shepstone Regional Hospital Lab'),

-- EASTERN CAPE
(gen_random_uuid(), 'NHLS – Nelson Mandela Academic Hospital / Walter Sisulu University Lab (Mthatha)'),
(gen_random_uuid(), 'NHLS – Frere Hospital Lab (East London)'),
(gen_random_uuid(), 'NHLS – Cecilia Makiwane Hospital Lab (Mdantsane)'),
(gen_random_uuid(), 'NHLS – Livingstone Hospital Lab (Gqeberha)'),
(gen_random_uuid(), 'NHLS – Dora Nginza Hospital Lab (Gqeberha)'),
(gen_random_uuid(), 'NHLS – Uitenhage Provincial Hospital Lab'),
(gen_random_uuid(), 'NHLS – Victoria Hospital Lab (Alice)'),
(gen_random_uuid(), 'NHLS – SS Gida Hospital Lab (Keiskammahoek)'),
(gen_random_uuid(), 'NHLS – Bisho Hospital Lab'),

-- FREE STATE
(gen_random_uuid(), 'NHLS – Universitas Academic Hospital Lab'),
(gen_random_uuid(), 'NHLS – Pelonomi Hospital Lab'),
(gen_random_uuid(), 'NHLS – Boitumelo Regional Hospital Lab (Kroonstad)'),
(gen_random_uuid(), 'NHLS – Bongani Regional Hospital Lab (Welkom)'),
(gen_random_uuid(), 'NHLS – Dihlabeng Regional Hospital Lab (Bethlehem)'),
(gen_random_uuid(), 'NHLS – Mofumahadi Manapo Mopeli Regional Hospital Lab (QwaQwa)'),

-- NORTH WEST
(gen_random_uuid(), 'NHLS – Tshepong Hospital Lab (Klerksdorp)'),
(gen_random_uuid(), 'NHLS – Klerksdorp/Tshepong Hospital Complex Microbiology Lab'),
(gen_random_uuid(), 'NHLS – Potchefstroom Hospital Lab'),
(gen_random_uuid(), 'NHLS – Mahikeng Provincial Hospital Lab'),
(gen_random_uuid(), 'NHLS – Rustenburg Provincial Hospital Lab'),
(gen_random_uuid(), 'NHLS – Moses Kotane Hospital Lab (Ledig)'),
(gen_random_uuid(), 'NHLS – Brits Hospital Lab'),

-- LIMPOPO
(gen_random_uuid(), 'NHLS – Mankweng Provincial Hospital Lab'),
(gen_random_uuid(), 'NHLS – Pietersburg/Polokwane Provincial Hospital Lab'),
(gen_random_uuid(), 'NHLS – Tzaneen (Letaba) Hospital Lab'),
(gen_random_uuid(), 'NHLS – Giyani Hospital Lab'),
(gen_random_uuid(), 'NHLS – Thohoyandou (Donald Fraser) Hospital Lab'),
(gen_random_uuid(), 'NHLS – Musina Hospital Lab'),
(gen_random_uuid(), 'NHLS – Mokopane Hospital Lab'),
(gen_random_uuid(), 'NHLS – Bela Bela (Warmbaths) Hospital Lab'),
(gen_random_uuid(), 'NHLS – Lebowakgomo Hospital Lab'),

-- MPUMALANGA
(gen_random_uuid(), 'NHLS – Rob Ferreira Hospital Lab (Mbombela)'),
(gen_random_uuid(), 'NHLS – Witbank/eMalahleni Hospital Lab'),
(gen_random_uuid(), 'NHLS – Themba Hospital Lab (Kabokweni)'),
(gen_random_uuid(), 'NHLS – Barberton Hospital Lab'),
(gen_random_uuid(), 'NHLS – Shongwe Hospital Lab'),
(gen_random_uuid(), 'NHLS – Ermelo Hospital Lab'),
(gen_random_uuid(), 'NHLS – Piet Retief (Mkhondo) Hospital Lab'),
(gen_random_uuid(), 'NHLS – Standerton Hospital Lab'),
(gen_random_uuid(), 'NHLS – Bethal Hospital Lab'),

-- NORTHERN CAPE
(gen_random_uuid(), 'NHLS – Robert Mangaliso Sobukwe Hospital Lab (Kimberley)'),
(gen_random_uuid(), 'NHLS – Upington Hospital Lab'),
(gen_random_uuid(), 'NHLS – De Aar Hospital Lab'),
(gen_random_uuid(), 'NHLS – Springbok Hospital Lab'),
(gen_random_uuid(), 'NHLS – Kuruman Hospital Lab'),

-- WESTERN CAPE (additional district/regional)
(gen_random_uuid(), 'NHLS – Karl Bremer Hospital Lab'),
(gen_random_uuid(), 'NHLS – Mitchells Plain District Hospital Micro Lab'),
(gen_random_uuid(), 'NHLS – Knysna Hospital Lab'),
(gen_random_uuid(), 'NHLS – Oudtshoorn Hospital Lab'),

-- GAUTENG (additional district/regional)
(gen_random_uuid(), 'NHLS – Edenvale Hospital Lab'),
(gen_random_uuid(), 'NHLS – Tambo Memorial Hospital Lab'),
(gen_random_uuid(), 'NHLS – Bheki Mlangeni District Hospital Lab'),

-- KZN (additional)
(gen_random_uuid(), 'NHLS – Stanger (General Justice Gizenga Mpanza) Hospital Lab'),
(gen_random_uuid(), 'NHLS – Manguzi Hospital Lab'),
(gen_random_uuid(), 'NHLS – St Andrews Hospital Lab'),
(gen_random_uuid(), 'NHLS – GJ Crookes Hospital Lab'),

-- EASTERN CAPE (additional)
(gen_random_uuid(), 'NHLS – Komani/Queenstown Frontier Hospital Lab'),
(gen_random_uuid(), 'NHLS – Victoria Hospital Alice Micro Lab')

ON CONFLICT DO NOTHING;
