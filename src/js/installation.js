(function () {
    var $accessYes = jQuery('#access_yes'),
        $accessNo = jQuery('#access_no');
    var accessYes = document.getElementById('access_yes');
    var accessNo = document.getElementById('access_no');
    if (accessYes != null && accessNo != null) {


        var $accessVisible = jQuery('.access-visible');

        if (!accessYes.checked && !accessNo.checked) {
            for (let el of $accessVisible) {
                el.style.visibility = 'hidden';
            }
        }
        if (accessYes.checked) {
            for (let el of $accessVisible) {
                el.style.visibility = 'visible';
            }
        }
        if (accessNo.checked) {
            for (let el of $accessVisible) {
                el.style.visibility = 'hidden';
            }
        }

        $accessYes.change(function () {
            for (let el of $accessVisible) {
                el.style.visibility = 'visible';
            }
        });

        $accessNo.change(function () {
            for (let el of $accessVisible) {
                el.style.visibility = 'hidden';
            }
        });
    }
    var clubNo = document.getElementById('club_no');
    var clubYes = document.getElementById('club_yes');

    var $clubhouseVisible = jQuery('.clubhouse-visible');
    var $cluhouseYes = jQuery('#club_yes');
    var $cluhouseNo = jQuery('#club_no');

    if (!clubNo || !clubYes) {
        return;
    }
    if ((!clubNo.checked && !clubYes.checked) || (clubNo.checked)) {
        console.log("no vlaue checkted");
        for (let el of $clubhouseVisible) {
            el.style.display = 'none';
        }
    }

    $cluhouseYes.change(function () {
        console.log("changedddd");
        for (let el of $clubhouseVisible) {
            el.style.display = clubYes.checked ? 'flex' : 'none';
        }
    });

    $cluhouseNo.change(function () {
        console.log("changedddd");
        for (let el of $clubhouseVisible) {
            el.style.display = clubYes.checked ? 'flex' : 'none';
        }
    });

}());
