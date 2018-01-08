import request from 'request-promise-native';
import readFile from './readFile';

const extract = (props, page) => (props.isProduction ? request(page.url) : readFile(props.file));

export default extract;
