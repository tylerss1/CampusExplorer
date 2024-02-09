export default class Room {
	public readonly fullname: string; // Full building name
	public readonly shortname: string; // Short building name
	public readonly number: string; // The room number. Not always a number so represented as a string
	public readonly name: string; // The room id. Should be rooms_shortname+"_"+rooms_number
	public readonly address: string; // The building address
	public readonly lat: number; // The latitude of the building
	public readonly lon: number; // The longitude of the building
	public readonly seats: number; // The number of seats in the room
	public readonly type: string; // The room type
	public readonly furniture: string; // The room furniture
	public readonly href: string; // The link to the full details online

	constructor(
		fullname: string,
		shortname: string,
		number: string,
		name: string,
		address: string,
		lat: number,
		lon: number,
		seats: number,
		type: string,
		furniture: string,
		href: string
	) {
		this.fullname = fullname;
		this.shortname = shortname;
		this.number = number;
		this.name = name;
		this.address = address;
		this.lat = lat;
		this.lon = lon;
		this.seats = seats;
		this.type = type;
		this.furniture = furniture;
		this.href = href;
	}
}
