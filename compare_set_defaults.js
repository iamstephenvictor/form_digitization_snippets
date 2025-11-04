// set default question response based on previous responses

Qualtrics.SurveyEngine.addOnload(function () {
    var Q11 = "${q://QID32/ChoiceGroup/SelectedChoices}";
    var Q14 = "${q://QID44/ChoiceGroup/SelectedChoices}";

    if (Q11 == 1 && Q14 == 1) {
        this.setChoiceValueByRecodeValue(1, "Yes");
    } else {
        this.setChoiceValueByRecodeValue(2, "No");
    }
});

// or...set default response based on comparison of dates from previous questions

Qualtrics.SurveyEngine.addOnReady(function () {
    // Get the embedded data values
    var dateOfEffortFinding = "${e://Field/DateOfEffortFinding}";
    var dateOfRemoval = "${e://Field/DateOfRemoval}";

    // Check if both dates exist and are not empty
    if (
        dateOfEffortFinding &&
        dateOfRemoval &&
        dateOfEffortFinding !== "" &&
        dateOfRemoval !== ""
    ) {
        // Parse the dates
        var effortDate = new Date(dateOfEffortFinding);
        var removalDate = new Date(dateOfRemoval);

        // Calculate the date 60 days after removal
        var removalPlus60 = new Date(removalDate);
        removalPlus60.setDate(removalPlus60.getDate() + 60);

        // Check if effort finding date is before or within 60 days after removal
        if (effortDate <= removalPlus60) {
            // Effort finding is before or within 60 days after removal
            this.setChoiceValueByRecodeValue(1, "Yes");
        } else {
            // Effort finding is more than 60 days after removal
            this.setChoiceValueByRecodeValue(2, "No");
        }
    }
});
