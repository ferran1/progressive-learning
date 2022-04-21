import { useRouter } from "next/router";
import * as React from "react";
import { useContext, useEffect } from "react";
import useSWR from "swr";
import { DEV_API_URL } from "../../config";
import LearningGoalExplore from "../../src/components/Explore/Learning-goal-explore/learning-goal-explore"
import { UserContext } from "../../src/helpers/Context";
import { LearningGoal } from "../../src/models/LearningGoal";
import LearningGoalDetail from "../../src/components/Explore/learning-unit-detail/Learning-Unit-detail"

function learningUnitPage({id}) {

    return <LearningGoalDetail id={id}/>
}

learningUnitPage.getInitialProps = (appContext) => {
    return { id: appContext.query.id }
}

export default learningUnitPage
