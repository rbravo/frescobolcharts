import React, { useState } from 'react';

function CollapsibleSection({ title, content }) {
    const [opened, setOpened] = useState(false);
    return (
        <div>
            <p>
                <a className="btn btn-primary" onClick={() => setOpened(!opened)}>
                    {title}
                </a>
            </p>
            {opened ?
                <div id="collapseExample">
                    <div className="card card-body" style={{fontSize: 10}}>
                        {content}
                    </div>
                </div>
                : null}
        </div>
    );
}

export default CollapsibleSection;
