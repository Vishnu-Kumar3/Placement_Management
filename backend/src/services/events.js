import { EventEmitter } from 'node:events';
export const placementEvents = new EventEmitter();
placementEvents.on('application:created', data => console.log('Application created:', data.applicationId));
placementEvents.on('resume:uploaded', data => console.log('Resume uploaded:', data.fileName, data.size, 'bytes'));
