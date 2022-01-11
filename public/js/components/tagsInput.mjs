class TagsInput {
  defaults = {
    selector: "",
    wrapperClass: "tags-input-wrapper",
    tagClass: "badge bg-primary",
    tagRemove: "&times;",
    max: null,
    duplicate: false,
  };

  constructor(opts = this.defaults) {
    this.options = Object.assign(this.defaults, opts);
    this.originalInput = document.getElementById(opts.selector);
    this.arr = [];
    this.wrapper = document.createElement("div");

    this.input = document.createElement("input");
    this.feeback = document.createElement("div");
    this.error = null;
    this.#buildUI(this);
    this.#addEvents(this);
  }

  addTag(value) {
    if (this.anyError(value)) {
      this.#responseError();
      return;
    }
    this.arr.push(value);

    const tag = document.createElement("span");
    tag.className = `${this.options.tagClass}`;
    tag.innerText = value;

    const closeIcon = document.createElement("a");
    closeIcon.className = "ms-2";
    closeIcon.style.textDecoration = "none";
    closeIcon.style.color = "currentColor";
    closeIcon.setAttribute("href", "#");

    closeIcon.innerHTML = this.options.tagRemove;

    closeIcon.addEventListener("click", event => {
      event.preventDefault();
      const selectedTag = event.target.parentNode;

      for (let i = 0; i < this.wrapper.childNodes.length; i++) {
        if (this.wrapper.childNodes[i] == selectedTag) {
          this.deleteTag(tag, i);
        }
      }
    });

    tag.appendChild(closeIcon);
    this.wrapper.insertBefore(tag, this.input);
    this.originalInput.value = this.arr.join(",");
    this.#resetError();
    return this;
  }

  deleteTag(tag, i) {
    tag.remove();
    this.arr.splice(i, 1);
    this.originalInput.value = this.arr.join(",");
    return this;
  }

  anyError(string) {
    if (this.options.max != null && this.arr.length >= this.options.max) {
      console.error("max tags limit reached");
      this.error = "max tags limit reached";
      return true;
    }

    if (!this.options.duplicate && this.arr.indexOf(string) != -1) {
      console.error('duplicate found " ' + string + ' " ');
      this.error = 'duplicate found " ' + string + ' " ';
      return true;
    }

    return false;
  }

  #responseError() {
    if (this.error) {
      const FeedbackEl = [].slice.call(
        this.wrapper.parentNode.querySelectorAll(".invalid-feedback")
      );

      FeedbackEl.forEach(fd => {
        fd.parentNode.removeChild(fd);
      });

      this.feeback.innerText = this.error;
      this.wrapper.parentNode.appendChild(this.feeback);
      this.wrapper.classList.add("is-invalid");
    }
  }

  #resetError() {
    if (this.feeback && this.error) {
      this.wrapper.classList.remove("is-invalid");
      this.error = null;
    }
  }

  #buildUI() {
    this.wrapper.append(this.input);
    const wrapperClass = `tags-input-wrapper ${this.options.wrapperClass}`;
    this.wrapper.className = wrapperClass;
    this.feeback.className = "invalid-feedback";

    if (this.originalInput) {
      this.originalInput.setAttribute("hidden", "true");
      this.originalInput.parentNode.insertBefore(
        this.wrapper,
        this.originalInput
      );

      const values = this.originalInput.value;

      if (values.trim() !== "") {
        values.split(",").forEach(item => {
          this.addTag(item);
        });
      }
    }
  }

  #addEvents() {
    this.wrapper.addEventListener("click", e => {
      this.input.focus();
    });

    this.input.addEventListener("keydown", e => {
      let str = this.input.value.trim();

      if (!!~[9, 13, 188].indexOf(e.keyCode)) {
        e.preventDefault();
        this.input.value = "";

        if (str != "") {
          e.preventDefault();
          this.addTag(str);
        }
      }
    });
  }
}

export default TagsInput;
