//Send Data
$(document).ready(function () {
    var newGroup = $('#addGuest97650').prev('.group').clone();
    var num = 0;
    var uid = 'Anonymus';


    $('#form-fill').click(function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();

        firebase.auth().signInWithPopup(provider).then((result) => {
            //var credential = result.credential;
            //var token = credential.accessToken;
            var user = result.user;
            uid = user.uid
            
          }).catch((error) => {
            console.log(error)
            document.getElementById('forms').setAttribute('style', "display:none; margin-top: 56px;")
          });
    })

    function resetRSVP_reqEvent(i, e) {
        $(e).change(function (e) {
            var eventReqFields = $(this).closest('.event').find('input:not(.notRequired), select:not(.rsvpResponse):not(.notRequired), textarea:not(.notRequired)');
            if (this.value == '1') {
                eventReqFields.prop('required', true);
                resetInvalidEvents($(this).closest('form'));
            } else {
                eventReqFields.prop('required', false);
                resetInvalidEvents($(this).closest('form'));
            }
        });
    }

    $('.rsvpResponse').each(resetRSVP_reqEvent);

    $('#addGuest97650 .add').click(function () {
        $this = $(this).parent();
        num = num + 1;
        var newGuest = newGroup.clone();
        
        newGuest.find('input, select, textarea').each(function () {
            nameVal = $(this).attr('name');
            nameNewVal = nameVal.replace('guests[0]', 'guests[' + num + ']');
            $(this).attr('name', nameNewVal);
        });
        newGuest.find('input.radio').each(function () {
            idVal = $(this).attr('id');
            forVal = $(this).next('label').attr('for');
            idNewVal = idVal.replace('yes0', 'yes' + num).replace('no0', 'no' + num);
            forNewVal = forVal.replace('yes0', 'yes' + num).replace('no0', 'no' + num);
            $(this).attr('id', idNewVal);
            $(this).next('label').attr('for', forNewVal);
        });
        newGuest.find('select').on('change', selectPlaceholder);
        newGuest.find('.rsvpResponse').each(resetRSVP_reqEvent);

        $this.before(newGuest.hide());
        $this.prev('.group').slideDown(400);
        if (num > 0) {
            $this.find('.sub').addClass('on');
        } else {
            $this.find('.sub').removeClass('on');
        }
        resetInvalidEvents($this.closest('form'));
    });

    $('#addGuest97650 .sub').click(function () {
        $this = $(this).parent();
        num = num - 1;
        $this.prev('.group').slideUp(400, function () {
            $(this).remove();
            if (num < 1) {
                $this.find('.sub').removeClass('on');
            }
            resetInvalidEvents($this.closest('form'));
        });
    });

    $('#rsvp297650').submit(function (e) {
        e.preventDefault();
        $this = $(this);
        const result = [...$this[0].getElementsByClassName('group guest')].map((element) => {
            return {
                'fullName': element.getElementsByTagName('input')[0].value,
                'Cerimonia': element.getElementsByTagName('select')[0].value,
                'Festa': element.getElementsByTagName('select')[1].value
            }
        });
        db.collection('guest-form').doc(uid).set({
            ...result
        }).then(
            $this[0].reset()
        );
    });
    resetInvalidEvents($('#rsvp297650'));
});