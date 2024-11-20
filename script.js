document.addEventListener("DOMContentLoaded", function() {
    const focusCheckbox = document.querySelector("[name=select-on-focus]")
    const copyBtn = document.querySelector(".copy")
    const textarea = document.querySelector('[name=textarea]');

    textarea && textarea.addEventListener("focus", function() {
        if (focusCheckbox.checked)
        {
            this.select()
        }
    })

    copyBtn && copyBtn.addEventListener("click", () => {
        if (textarea)
        {
            textarea.select()
            navigator.clipboard.writeText(textarea.value)
        }
    })
})

function convert(form) {
    const textarea = form.querySelector('[name=textarea]');
    const init = textarea.value;

    if (init.includes('<h3>') && !init.includes('$faq_list'))
    {
        const tags = ['<h3>', '</h3>'];
        const data = [];

        let output = '{$faq_list = [';
        let openIndex = 0, closeIndex = 0;

        openIndex = init.indexOf(tags[0]);

        // PARSING
        while (true) 
        {
            closeIndex = init.indexOf(tags[1], openIndex);

            if (closeIndex === -1) break;

            data.push([init.slice(openIndex + tags[0].length, closeIndex).trim()])

            openIndex = init.indexOf(tags[0], closeIndex);

            if (openIndex === -1) {
                data[data.length - 1].push(init.slice(closeIndex + tags[1].length).trim().replaceAll('\n', ' '))
                break;
            };

            data[data.length - 1].push(init.slice(closeIndex + tags[1].length, openIndex).trim().replaceAll('\n', ''))
        }

        console.log(data)

        // FORMING OUTPUT
        data.forEach(d => {
            output += `\n[\n\t"${d[0]}",\n\t"${d[1]}"\n],`
        })

        // REMOVING LAST COMMA
        if (data.length)
            output = output.slice(0, output.length - 1) + '\n'

        output += ']}\n\n\{include file="components/faq.tpl"}';

        textarea.value = output
    }

    return false
}