class Program {
    /**
     * 
     * @param {Number} id 
     * @param {String} extension 
     * @param {String} name 
     */
    constructor(id, name, extension) {
        this.id = id;
        this.name = name;
        this.nameID = name.replace(/\s+/g, '-').toLowerCase();
        this.extension = extension;
        this.visible = true;
        this.open();
    }

    setAll(id, name, extension) {
        this.id = id;
        this.extension = extension;
        this.name = name;
        this.nameID = name.replace(/\s+/g, '-').toLowerCase();
    }

    loadContent(container) {
        switch (this.extension) {
            case 'folder':
                data.then(data => {
                    let folder = data[0].items.find(item => item.id == this.id);
                    let folders = [], files = [];
                    folder.items.forEach(id => {
                        let item = data[0].items.find(item => item.id == id);
                        if (item.extension == 'folder') {
                            folders.push(item);
                        } else {
                            files.push(item);
                        }
                    });

                    let item_container = document.createElement('div');
                    item_container.className = 'item-container folder';
                    if (folders.length > 0) {
                        folders.forEach(async (f) => {
                            let fldr = document.createElement('div');
                            fldr.className = `item ${f.id}`;
                            let fldr_ico = document.createElement('img');
                            fldr_ico.src = await this.findIcon(f.extension);
                            let fldr_span = document.createElement('span');
                            fldr_span.textContent = f.name;

                            fldr.append(fldr_ico, fldr_span);
                            item_container.append(fldr);
                        });
                    }

                    if (files.length > 0) {
                        files.forEach(async (f) => {
                            let file = document.createElement('div');
                            file.className = `item ${f.id}`;
                            let file_ico = document.createElement('img');
                            file_ico.src = await this.findIcon(f.extension);
                            let file_span = document.createElement('span');
                            file_span.textContent = f.name;

                            file.append(file_ico, file_span);
                            item_container.append(file);
                        });
                    }

                    if (folders.length + files.length == 0) {
                        let empty = document.createElement('div');
                        empty.textContent = 'This folder is empty.'
                        item_container.append(empty);
                    }

                    container.innerHTML = '';
                    container.append(item_container);
                })
                break;
            
            case 'image':
                data.then(data => {
                    let image = data[0].items.find(item => item.id == this.id);
                    let DOM_img = document.createElement('img');
                    DOM_img.src = image.src;
                    container.classList.add('image');

                    container.append(DOM_img);
                    this.maximiseToggle();
                });
                break;

            default:
                fetch(`files/${this.nameID}.html`).then(response => { return response.text() }).then(data => {
                    container.innerHTML = data;
                })
                break;
        }
    }

    async open() {
        let bar_left = document.querySelector('.taskbar__left');
        let new_program = document.createElement('div');
        new_program.className = 'taskbar__action program'
        new_program.dataset.target = this.nameID;
        let np_icon = document.createElement('img');
        np_icon.src = await this.findIcon(this.extension);
        np_icon.width = 19;
        let np_title = document.createElement('span');
        np_title.textContent = this.name;
        new_program.append(np_icon, np_title);
        bar_left.append(new_program);


        let posx = Math.random() * (500 - 100) + 100;
        let posy = Math.round(Math.random() * 100);
        let new_window = document.createElement('div');
        new_window.className = 'window';
        new_window.id = this.nameID;
        new_window.style.cssText = `display: block; left: ${posx}px; top: ${posy}px;`;

        let window_inner = document.createElement('div');
        window_inner.className = 'window__inner';

        let window_header = document.createElement('div');
        window_header.className = 'window__header';

        let window_icon = document.createElement('img');
        window_icon.className = 'window__icon';
        window_icon.src = await this.findIcon(this.extension);
        window_icon.width = 19;

        let window_title = document.createElement('p');
        window_title.className = 'window__title'
        window_title.innerText = this.name;

        let window_close = document.createElement('div');
        window_close.className = 'window__action close';

        let window_maximise = document.createElement('div');
        window_maximise.className = 'window__action maximise';

        let window_minimise = document.createElement('div');
        window_minimise.className = 'window__action minimise';

        let window_content = document.createElement('div');
        window_content.className = 'window__content';

        let window_footer = document.createElement('div');
        window_footer.className = 'window__footer';
        let resize = document.createElement('div');
        resize.className = 'resize';
        
        window_footer.append(resize);
        window_header.append(window_icon, window_title, window_close, window_maximise, window_minimise);
        window_inner.append(window_header, window_content, window_footer);
        new_window.append(window_inner);
        document.body.append(new_window);

        this.addFocus();
        this.loadContent(window_content);
    }

    update(id, name, extension) {
        let window = this.findWindow();
        let program_bar = this.findProgramBar(this.nameID);
        this.setAll(id, name, extension);
        this.loadContent(window.querySelector('.window__content'));
        
        window.querySelector('.window__header > .window__title').innerText = this.name;
        program_bar.dataset.target = this.nameID;
        program_bar.querySelector('span').innerText = this.name;
        window.id = this.nameID;
    }

    close() {
        this.findWindow().remove();
        this.findProgramBar().remove();
    }

    maximiseToggle() {
        this.findWindow().classList.toggle('maximised');
    }

    minimise() {
        this.findWindow().style.display = 'none';
        Program.removeFocus();
        this.visible == false;
    }

    restore() {
        this.findWindow().style.display = 'block';
        this.addFocus();
        this.visible == true;
    }

    toggleVisibility() {
        if (this.visible) {
            if (this.findWindow().classList.contains('focus')) {
                this.minimise();
            } else {
                this.restore();
            }
        } else {
            this.restore();
        }
    }

    addFocus() {
        Program.removeFocus();
        this.findWindow().classList.add('focus');
        this.findProgramBar().classList.add('focus');
    }

    findWindow() {
        return document.querySelector(`#${CSS.escape(this.nameID)}`);
    }

    findProgramBar() {
        return document.querySelector(`[data-target=${CSS.escape(this.nameID)}]`);
    }

    static removeFocus() {
        document.querySelectorAll('.window').forEach(wndow => { wndow.classList.remove('focus') })
        document.querySelectorAll('.program').forEach(wndow => { wndow.classList.remove('focus') });
    }

    static findByID(id) {
        return programs.find(program => program.id == id);
    }

    static findByName(name) {
        return programs.find(program => program.nameID == name);
    }

    static findIndexByName(name) {
        return programs.findIndex(program => program.nameID == name)
    }

    async findIcon(extension) {
        return data.then(data => {
            return data[1].icons.find(icon => icon.extension == extension).icon;
        })
    }
}