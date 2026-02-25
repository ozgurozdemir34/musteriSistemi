export interface Musteri {
  id: number;
  ad: string;
  soyad: string;
  tarih: string;
  durum:string;
  kimlikNumarasi:string
  mail: { email: string }[];
  telefon?: { numara: string }[];

}

export interface Telefon {
  id: number;
  musteriId: number;
  numara: string;
}

export interface Mail {
  id: number;
  musteriId: number;
  email: string;
}

