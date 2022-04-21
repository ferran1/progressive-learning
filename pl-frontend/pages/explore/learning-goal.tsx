import * as React from "react";
import LearningGoalDetail from "../../src/components/Explore/Learning-goal-detail/learning-goal-detail"
import {Breadcrumb} from "antd";

function ExploreLearningGoalDetail({id}) {

    return (
        <div>
            <LearningGoalDetail id={id}/>
        </div>
    );

}

ExploreLearningGoalDetail.getInitialProps = (appContext) => {
    return {id: appContext.query.id}
}

export default ExploreLearningGoalDetail
