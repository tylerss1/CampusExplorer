import * as fs from "fs-extra";
import JSZip from "jszip";
import {InsightError} from "../IInsightFacade";
import Section from "../../model/Section";
import SectionHandler from "./SectionHandler";

export default class DiskHandler {
	public async saveSection(id: string, content: string) {
		let dir = "./data";

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		try {
			// Create a buffer from the base64 encoded content
			const zipBuffer = Buffer.from(content, "base64");

			// Load the zip file using JSZip
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

			let sections: {[key: string]: any} = {};
			for (let i = 0; i < mergedCourses.length; i++) {
				let key = "Course" + i;
				sections[key] = mergedCourses[i];
			}

			const outputFilePath = dir + "/" + id + ".json";
			await fs.writeJson(outputFilePath, sections, {spaces: 2});
		} catch (error) {
			return new InsightError("Error saving section");
		}
	}

	public retrieveDisk(): Map<string, Section[]> {
		const directoryPath = "./data";
		const sectionsMap = new Map<string, Section[]>();
		let sectionHandler = new SectionHandler();

		if (!fs.existsSync(directoryPath)) {
			fs.mkdirSync(directoryPath);
			return sectionsMap;
		}

		const files = fs.readdirSync(directoryPath);

		for (const file of files) {
			let name = "";
			const extension = ".json";
			if (file.endsWith(extension)) {
				name = file.slice(0, -extension.length);
			}

			const filePath = `${directoryPath}/${file}`;
			const sectionsList: Section[] = sectionHandler.loadSectionData(filePath);
			sectionsMap.set(name, sectionsList);
		}

		return sectionsMap;
	}
}
