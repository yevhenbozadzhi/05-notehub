import css from "../../css/SearchBox.module.css"

export default function SearchBox() {
    return (
        <header>
            <input
  className={css.input}
  type="text"
  placeholder="Search notes"
 />
        </header>
    )
}
