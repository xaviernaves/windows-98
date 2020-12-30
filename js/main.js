function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

if (isMobileDevice()) {
    document.body.innerHTML = `
    <div class="blue-screen">
        <p>*** STOP: INVALID_DEVICE</p>
        
        <p>If this is the first time you've seen this Stop error screen,
        this website is not accessible with mobile and tablet devices due to touch issues.</p>

        <p>Please use a laptop or a PC to visit the website, if you don't have access to one
        you may visit my <a href="https://google.com">other portfolio</a> which is mobile-friendly.</p>
    </div>`;
} else {
    let today;
    let hour_DOM = document.querySelector('.hour');
    let updateClock = () => {
        today = new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' });
        hour_DOM.textContent = today;
    }
    updateClock();
    setInterval(() => { updateClock() }, 1000);

    var programs = [];
    var data = fetch("./data.json").then(response => { return response.json() }).then(data => {
        document.addEventListener('dblclick', function (e) {
            if (e.target && e.srcElement.closest('.item')) {
                let item = e.srcElement.closest('.item'), wndw = item.closest('.window');
                if (item.classList.length > 1) {
                    let itemID = item.classList[1], items = data[0].items;
                    let itemData = items.find(itm => itm.id == itemID);

                    try {
                        if (itemData) {
                            if (!programs.find(program => program.id == itemData.id)) {
                                if (items.find(itm => itm.id == itemID).extension == 'folder' && wndw) {
                                    Program.findByName(wndw.id).update(itemData.id, itemData.name, itemData.extension);
                                } else {
                                    programs.push(new Program(itemData.id, itemData.name, itemData.extension))
                                }
                            } else {
                                Program.findByID(itemData.id).restore();
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }

                if (e.srcElement.closest('a')) {
                    let a = e.srcElement.closest('a');
                    if (a.href.includes('mailto:')) {
                        window.location = a.href;
                    } else {
                        window.open(a.href, '_blank');
                    }
                }
            }

            if (e.srcElement.closest('.window__header')) {
                let name = e.srcElement.closest('.window').id;
                Program.findByName(name).maximiseToggle();
            }
        })
        return data;
    });

    document.addEventListener('mouseover', function (e) {
        if (e.target && e.srcElement.closest('.window')) {
            dragWindow(e.srcElement.closest('.window'));
            resizeWindow(e.srcElement.closest('.window'), e);
        }
    });
    document.addEventListener('click', function (e) {
        if (e.target) {
            if (e.srcElement.closest('.item')) {
                e.preventDefault();
                return;
            }
            if (e.srcElement.closest('.window')) {
                let name = e.srcElement.closest('.window').id;
                Program.removeFocus();
                Program.findByName(name).addFocus();
            }

            if (e.srcElement.classList.contains('close')) {
                let programIndex = Program.findIndexByName(e.path.find(element => element.classList.contains('window')).id);
                programs[programIndex].close();
                programs.splice(programIndex, 1);
            }

            if (e.srcElement.classList.contains('maximise')) {
                Program.findByName(e.path.find(element => element.classList.contains('window')).id).maximiseToggle();
            }

            if (e.srcElement.classList.contains('minimise')) {
                Program.findByName(e.path.find(element => element.classList.contains('window')).id).minimise();
            }

            if (e.srcElement.closest('.program')) {
                Program.findByName(e.srcElement.closest('.program').dataset.target).toggleVisibility();
            }
        }
    })
}