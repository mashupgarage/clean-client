/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Store {
  id: number;
  name: string;
  url: string;
  owner: string;
  address: string;
  description: string;
  image: string;
  managers: number[];
  relative_image_path: string;
  machines: any[];
}
