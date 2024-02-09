export default class Section {
	public readonly uuid: string; // id
	public readonly id: string; // Course
	public readonly title: string; // Title
	public readonly instructor: string; // Professor
	public readonly dept: string; // Subject
	public readonly year: number; // Year
	public readonly avg: number; // Avg
	public readonly pass: number; // Pass
	public readonly fail: number; // Fail
	public readonly audit: number; // Audit

	constructor(
		uuid: string,
		id: string,
		title: string,
		instructor: string,
		dept: string,
		year: number,
		avg: number,
		pass: number,
		fail: number,
		audit: number
	) {
		this.uuid = uuid;
		this.id = id;
		this.title = title;
		this.instructor = instructor;
		this.dept = dept;
		this.year = year;
		this.avg = avg;
		this.pass = pass;
		this.fail = fail;
		this.audit = audit;
	}
}
