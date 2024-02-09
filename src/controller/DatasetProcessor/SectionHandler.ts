import * as fs from "fs-extra";
import Section from "../../model/Section";
import {InsightError} from "../IInsightFacade";
import JSZip from "jszip";

export default class SectionHandler {
	public validateID(id: string): boolean {
		if (id.indexOf("_") > -1) {
			return false;
		}
		if (!id.replace(/\s/g, "").length) {
			return false;
		} else {
			return true;
		}
	}

	public validateContent(content: string): boolean {
		return !(content === null || content === "");
	}

	public loadSectionData(filePath: string): Section[] {
		const rawData = fs.readFileSync(filePath, "utf-8");
		const jsonData = JSON.parse(rawData);

		let sections: Section[] = [];

		Object.keys(jsonData).forEach((key) => {
			for (const sectionData of jsonData[key].result) {
				if (
					!(
						sectionData.id !== undefined &&
						sectionData.Course !== undefined &&
						sectionData.Title !== undefined &&
						sectionData.Professor !== undefined &&
						sectionData.Subject !== undefined &&
						sectionData.Year !== undefined &&
						sectionData.Avg !== undefined &&
						sectionData.Pass !== undefined &&
						sectionData.Fail !== undefined &&
						sectionData.Audit !== undefined
					)
				) {
					continue; // Skip this iteration if any required field is missing
				}
				if (sectionData.Section === "overall") {
					sectionData.Year = 1900;
				}

				const newSection = new Section(
					sectionData.id.toString(),
					sectionData.Course.toString(),
					sectionData.Title,
					sectionData.Professor,
					sectionData.Subject,
					parseInt(sectionData.Year, 10),
					parseFloat(sectionData.Avg),
					parseInt(sectionData.Pass, 10),
					parseInt(sectionData.Fail, 10),
					parseInt(sectionData.Audit, 10)
				);

				sections.push(newSection);
			}
		});
		return sections;
	}

	public async loadSectionToMemory(id: string, content: string): Promise<Map<string, Section[]>> {
		const zipBuffer = Buffer.from(content, "base64");
		const zip = await JSZip.loadAsync(zipBuffer);
		let mergedCourses: any[] = [];
		const promises = Object.keys(zip.files).map(async (fileName) => {
			const file = zip.files[fileName];
			const fileDir = fileName.substring(fileName.indexOf("/") + 1);
			if (fileDir.startsWith("courses/") && !file.dir) {
				const fileContent = await file.async("text");
				const jsonData = JSON.parse(fileContent);
				mergedCourses = mergedCourses.concat(jsonData);
			}
		});
		await Promise.all(promises);
		const sectionMap = new Map<string, Section[]>();
		sectionMap.set(id, []);
		for (const result of mergedCourses) {
			for (const sectionData of result.result) {
				if (
					!(
						sectionData.id !== undefined &&	sectionData.Course !== undefined &&
						sectionData.Title !== undefined && sectionData.Professor !== undefined &&
						sectionData.Subject !== undefined && sectionData.Year !== undefined &&
						sectionData.Avg !== undefined && sectionData.Pass !== undefined &&
						sectionData.Fail !== undefined && sectionData.Audit !== undefined
					)
				) {
					continue; // Skip this iteration if any required field is missing
				}
				if (sectionData.Section === "overall") {
					sectionData.Year = 1900;
				}
				const newSection = new Section(
					sectionData.id.toString(),
					sectionData.Course.toString(),
					sectionData.Title,
					sectionData.Professor,
					sectionData.Subject,
					parseInt(sectionData.Year, 10),
					parseFloat(sectionData.Avg),
					parseInt(sectionData.Pass, 10),
					parseInt(sectionData.Fail, 10),
					parseInt(sectionData.Audit, 10)
				);
				sectionMap.get(id)?.push(newSection);
			}
		}
		return sectionMap;
	}
}
