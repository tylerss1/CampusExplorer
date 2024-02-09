import {randomUUID} from "crypto";
import {InsightError, InsightResult} from "../controller/IInsightFacade";
import Section from "../model/Section";
import {AbstractQueryNode} from "./AbstractQueryNode";
import {Options} from "./QueryModel";

export class OptionsNode extends AbstractQueryNode {
	public declare token: string;
	private keyList: string[] = ["avg", "pass", "fail", "audit", "year", "dept", "id", "instructor", "title", "uuid"];
	public idstring: string = "";
	public givenKeys: string[] = [];
	public order: string = "default";

	constructor(token: string) {
		super(token);
	}

	public build_tree(query: any): string {
		let oQuery: Options = query;
		let columns: string = Object.keys(oQuery)[0];
		if (columns !== "COLUMNS") {
			throw new InsightError("bad query: incorrect columns");
		}
		if (oQuery[columns] instanceof Array && oQuery[columns].length > 0) {
			let arr: string[] = oQuery[columns];
			for (const elem of arr) {
				let idstring: string = elem.substring(0, elem.indexOf("_"));
				if (this.idstring.length === 0) {
					this.idstring = idstring;
				} else {
					if (this.idstring !== idstring) {
						throw new InsightError("multiple datasets referenced: second instance in columns");
					}
				}
				// check id string is in currently added DataSets
				let key: string = elem.substring(elem.indexOf("_") + 1);
				if (this.keyList.indexOf(key) === -1) {
					throw new InsightError("bad key given in columns");
				}
				this.givenKeys.push(key);
			}
		} else {
			throw new InsightError("bad columns");
		}
		if (Object.keys(oQuery).length > 1) {
			let order: string = Object.keys(oQuery)[1];
			if (order === "ORDER") {
				let idstring2: string = oQuery[order].substring(0, oQuery[order].indexOf("_"));
				if (this.idstring !== idstring2) {
					throw new InsightError("bad order: multiple datasets referenced");
				}
				let orderKey: string = oQuery[order].substring(oQuery[order].indexOf("_" + 1));
				if (this.keyList.indexOf(orderKey) !== -1) {
					this.order = orderKey;
				}
			} else {
				throw new InsightError("bad order");
			}
		}
		return this.idstring;
	}

	public performSection(row: Section): InsightResult {
		let result: InsightResult = {};
		for (const elem of this.givenKeys) {
			let key: string = "sections_" + elem;
			switch (elem) {
				case "avg":
					result[key] = row.avg;
					break;
				case "pass":
					result[key] = row.pass;
					break;
				case "fail":
					result[key] = row.fail;
					break;
				case "audit":
					result[key] = row.audit;
					break;
				case "year":
					result[key] = row.year;
				case "dept":
					result[key] = row.dept;
				case "id":
					result[key] = row.id;
				case "instructor":
					result[key] = row.instructor;
				case "title":
					result[key] = row.title;
				case "uuid":
					result[key] = row.uuid;
				default:
					break;
			}
		}
		return result;
	}

	public performSectionOrder(rows: InsightResult[]): void {
		if (this.order === "default") {
			return;
		}
		let key: string = "sections_" + this.order;
		rows.sort((a, b) => (a.key > b.key ? 1 : -1));
		return;
	}
}
