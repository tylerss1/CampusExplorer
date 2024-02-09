import {KeyObject} from "crypto";
import {InsightError} from "../controller/IInsightFacade";
import {AbstractQueryNode} from "./AbstractQueryNode";
import {MComp} from "./QueryModel";
import {stringify} from "querystring";
import Room from "../model/Room";
import Section from "../model/Section";

export class MCompNode extends AbstractQueryNode {
	// logic = comparator LT, GT, or EQ
	public declare token: string;
	// infield: format {'mkey': 'number'}
	public declare mkey: string;
	public declare num: number;
	private mfields: string[] = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats"];
	private declare mfield;

	constructor(token: string) {
		super(token);
	}

	public build_tree(query: MComp): string {
		// input: "sections_avg":97
		let mkey: string = Object.keys(query)[0];
		if (typeof mkey === "string" && typeof query[mkey] === "number") {
			this.mkey = mkey;
			this.num = query[mkey];
		} else {
			throw new InsightError("Incorrect mComp");
		}
		let idstring: string = this.mkey.substring(0, this.mkey.indexOf("_"));
		let mfield: string = this.mkey.substring(this.mkey.indexOf("_") + 1);
		if (this.mfields.indexOf(mfield) < 0) {
			throw new InsightError("Incorrect mComp");
		}
		this.mfield = mfield;
		return idstring;
	}

	public performSection(row: Section): boolean {
		if (this.mfield === "avg") {
			return this.performAvg(row);
		} else if (this.mfield === "pass") {
			return this.performPass(row);
		} else if (this.mfield === "fail") {
			return this.performFail(row);
		} else if (this.mfield === "audit") {
			return this.performAudit(row);
		} else if (this.mfield === "year") {
			return this.performYear(row);
		}
		return false;
	}

	public performRoom(row: Room): boolean {
		if (this.mfield === "lat") {
			return this.performLat(row);
		} else if (this.mfield === "lon") {
			return this.performLon(row);
		} else if (this.mfield === "seats") {
			return this.performSeats(row);
		}
		return false;
	}

	private performAvg(row: Section): boolean {
		if (
			(this.token === "LT" && row["avg"] < this.num) ||
			(this.token === "GT" && row["avg"] > this.num) ||
			(this.token === "EQ" && row["avg"] === this.num)
		) {
			return true;
		}
		return false;
	}

	private performPass(row: Section): boolean {
		if (
			(this.token === "LT" && row["pass"] < this.num) ||
			(this.token === "GT" && row["pass"] > this.num) ||
			(this.token === "EQ" && row["pass"] === this.num)
		) {
			return true;
		}
		return false;
	}

	private performFail(row: Section): boolean {
		if (
			(this.token === "LT" && row["fail"] < this.num) ||
			(this.token === "GT" && row["fail"] > this.num) ||
			(this.token === "EQ" && row["fail"] === this.num)
		) {
			return true;
		}
		return false;
	}

	private performAudit(row: Section): boolean {
		if (
			(this.token === "LT" && row["audit"] < this.num) ||
			(this.token === "GT" && row["audit"] > this.num) ||
			(this.token === "EQ" && row["audit"] === this.num)
		) {
			return true;
		}
		return false;
	}

	private performYear(row: Section): boolean {
		if (
			(this.token === "LT" && row["year"] < this.num) ||
			(this.token === "GT" && row["year"] > this.num) ||
			(this.token === "EQ" && row["year"] === this.num)
		) {
			return true;
		}
		return false;
	}

	private performLat(row: Room): boolean {
		if (
			(this.token === "LT" && row["lat"] < this.num) ||
			(this.token === "GT" && row["lat"] > this.num) ||
			(this.token === "EQ" && row["lat"] === this.num)
		) {
			return true;
		}
		return false;
	}

	private performLon(row: Room): boolean {
		if (
			(this.token === "LT" && row["lon"] < this.num) ||
			(this.token === "GT" && row["lon"] > this.num) ||
			(this.token === "EQ" && row["lon"] === this.num)
		) {
			return true;
		}
		return false;
	}

	private performSeats(row: Room): boolean {
		if (
			(this.token === "LT" && row["seats"] < this.num) ||
			(this.token === "GT" && row["seats"] > this.num) ||
			(this.token === "EQ" && row["seats"] === this.num)
		) {
			return true;
		}
		return false;
	}
}
