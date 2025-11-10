import {all, call} from 'redux-saga/effects';
// import {saga as TemplateSagas} from './template.sagas';
// import {fetchAccountSagas, saveAccountSagas} from './account.sagas';

export default function* mySaga(): Generator {
  yield all([
    // call(TemplateSagas),
    // call(fetchAccountSagas),
    // call(saveAccountSagas),
  ]);
}
