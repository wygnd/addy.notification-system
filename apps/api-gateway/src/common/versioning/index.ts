import {NestFastifyApplication} from "@nestjs/platform-fastify";
import {VersioningType} from "@nestjs/common";

export const setupAppVersioning = (app: NestFastifyApplication): void => {
	app.enableVersioning({
		type: VersioningType.URI
	})
}