import LoggedReducer from "./LoggedReducer";
import MediaLoginErrorReducer from "./MediaLoginErrorReducer";
import GetProfileReducer from "./GetProfileReducer";
import StudioImageCropReducer from "./StudioImageCropReducer";
import GetTinyBodyReducer from "./GetTinyBodyReducer";
import OverlayReducer from "./OverlayReducer";
import SearchQueryReducer from "./SearchQueryReducer";
import ChartBoxReducer from "./ChartBoxReducer";
import RowUpdateReducer from "./RowUpdateReducer";
import { combineReducers} from "redux";


const allReducers = combineReducers({
    logged: LoggedReducer,
    mediaLoginError: MediaLoginErrorReducer,
    profileView: GetProfileReducer,
    imageCrop: StudioImageCropReducer,
    getBody: GetTinyBodyReducer,
    overlay: OverlayReducer,
    searchQuery: SearchQueryReducer,
    chartQuery: ChartBoxReducer,
    rowUpdate: RowUpdateReducer
})

export default allReducers;